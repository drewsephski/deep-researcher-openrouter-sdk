"use client";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import React, { useEffect, useRef } from "react";
import { useDeepResearchStore } from "@/store/deepResearch";
import { type Activity, type Source } from "@/app/api/deep-research/types";
import CompletedQuestions from "./CompletedQuestions";
import QuestionForm from "./QuestionForm";
import ResearchActivities from "./ResearchActivities";
import ResearchReport from "./ResearchReport";
import ResearchTimer from "./ResearchTimer";

interface DataPart {
  type: string;
  data: Activity | string;
}

const QnA = () => {
  const {
    questions,
    isCompleted,
    topic,
    answers,
    setIsLoading,
    setActivities,
    setSources,
    setReport,
  } = useDeepResearchStore();

  const hasStartedRef = useRef(false);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/deep-research",
    }),
    onData: (dataPart) => {
      const part = dataPart as DataPart;
      // Handle activity data parts
      if (part.type === "data-activity") {
        const activity = part.data as Activity;
        setActivities((prev: Activity[]) => [...prev, activity]);

        // Extract sources from extract activities
        if (
          activity.type === "extract" &&
          activity.status === "complete"
        ) {
          const url = activity.message.split("from ")[1];
          if (url) {
            setSources((prev: Source[]) => [
              ...prev,
              {
                url,
                title: url?.split("/")[2] || url,
              },
            ]);
          }
        }
      }

      // Handle report data parts
      if (part.type === "data-report") {
        setReport(part.data as string);
      }
    },
  });

  // Update loading state based on status
  useEffect(() => {
    const isLoading = status === "submitted" || status === "streaming";
    setIsLoading(isLoading);
  }, [status, setIsLoading]);

  // Extract report from message parts as fallback
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "assistant" && lastMessage.parts) {
        const textParts = lastMessage.parts.filter(
          (part: { type: string; text?: string }) => part.type === "text"
        );
        if (textParts.length > 0) {
          const text = textParts.map((part: { type: string; text?: string }) => part.text).join("");
          if (text.includes("<report>")) {
            setReport(text);
          }
        }
      }
    }
  }, [messages, setReport]);

  useEffect(() => {
    if (isCompleted && questions.length > 0 && !hasStartedRef.current) {
      hasStartedRef.current = true;
      const clarifications = questions.map((q, index) => ({
        question: q.question,
        answer: answers[index],
      }));

      sendMessage({
        text: JSON.stringify({
          topic: topic,
          clarifications: clarifications,
        }),
      });
    }
  }, [isCompleted, questions, answers, topic, sendMessage]);

  if (questions.length === 0) return null;

  return (
    <div className="flex w-full flex-col items-start gap-6 sm:gap-8 animate-fade-in-up">
      <QuestionForm />
      <CompletedQuestions />
      <div className="flex items-center gap-4">
        <ResearchTimer />
      </div>
      <ResearchActivities />
      <ResearchReport />
    </div>
  );
};

export default QnA;
