import QnA from "@/components/ui/deep-research/QnA";
import UserInput from "@/components/ui/deep-research/UserInput";
import { Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      {/* Subtle dot grid background */}
      <div className="absolute inset-0 bg-dot-grid opacity-50 pointer-events-none" />

      {/* Asymmetric content layout */}
      <div className="relative z-10 flex flex-col items-start px-6 sm:px-12 lg:px-20 xl:px-32 py-16 sm:py-24 gap-10 sm:gap-14">
        {/* Hero section — asymmetric with intentional whitespace */}
        <div className="flex flex-col items-start gap-5 max-w-3xl animate-fade-in-up">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium tracking-wide uppercase bg-primary/[0.08] text-primary rounded-full border border-primary/10">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Research
            </span>
          </div>

          <h1 className="text-display font-sans font-semibold text-foreground tracking-tight">
            Deep Research
          </h1>

          <p className="text-lead text-muted-foreground max-w-xl leading-relaxed font-body">
            Enter a topic and answer a few clarifying questions to generate a
            comprehensive, well-sourced research report.
          </p>
        </div>

        {/* Input section with breathing room */}
        <div className="w-full max-w-2xl animate-fade-in-up delay-200">
          <UserInput />
        </div>

        {/* Q&A section */}
        <QnA />
      </div>
    </main>
  );
}
