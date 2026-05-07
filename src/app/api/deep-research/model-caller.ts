import { generateText, Output } from "ai";
import { z } from "zod";
import { openrouter } from "./services";
import { ActivityTracker, ModelCallOptions, ResearchState } from "./types";
import { MAX_RETRY_ATTEMPTS, RETRY_DELAY_MS, FALLBACK_MODEL } from "./constants";
import { delay } from "./utils";


async function executeGenerate<T>(
  modelId: string,
  prompt: string,
  system: string,
  schema?: z.ZodType<T>
): Promise<{ result: T | string; usage: { totalTokens?: number } }> {
  if (schema) {
    const { output, usage } = await generateText({
      model: openrouter(modelId),
      prompt,
      system,
      output: Output.object({ schema }),
    });
    return { result: output as T, usage };
  } else {
    const { text, usage } = await generateText({
      model: openrouter(modelId),
      prompt,
      system,
    });
    return { result: text, usage };
  }
}

export async function callModel<T>({
    model, prompt, system, schema, activityType = "generate"
}: ModelCallOptions<T>,
researchState: ResearchState, activityTracker: ActivityTracker ): Promise<T | string>{

  let attempts = 0;
  let lastError: Error | null = null;
  let currentModel = model;

  while(attempts < MAX_RETRY_ATTEMPTS){
    try{
      const { result, usage } = await executeGenerate(currentModel, prompt, system, schema);

      researchState.tokenUsed += usage.totalTokens ?? 0;
      researchState.completedSteps++;

      return result as T | string;
    }catch(error){
       attempts++;
       lastError = error instanceof Error ? error : new Error('Unknown error');

       if(attempts < MAX_RETRY_ATTEMPTS){
        activityTracker.add(activityType, 'warning', `Model call failed with ${currentModel}, attempt ${attempts}/${MAX_RETRY_ATTEMPTS}. Retrying...`)
       }
       await delay(RETRY_DELAY_MS*attempts)
    }
  }

  // Fallback model attempt after primary retries are exhausted
  try {
    activityTracker.add(activityType, 'warning', `Primary model exhausted. Trying fallback model ${FALLBACK_MODEL}...`);
    const { result, usage } = await executeGenerate(FALLBACK_MODEL, prompt, system, schema);

    researchState.tokenUsed += usage.totalTokens ?? 0;
    researchState.completedSteps++;

    return result as T | string;
  } catch (fallbackError) {
    const fallbackErr = fallbackError instanceof Error ? fallbackError : new Error('Unknown fallback error');
    throw fallbackErr || lastError || new Error(`Failed after ${MAX_RETRY_ATTEMPTS} attempts and fallback!`);
  }
}