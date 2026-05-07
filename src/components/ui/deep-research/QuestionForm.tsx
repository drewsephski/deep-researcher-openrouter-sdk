import React from 'react'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { useDeepResearchStore } from '@/store/deepResearch'
import { Check, ChevronLeft } from "lucide-react";

const QuestionForm = () => {
    const {questions, currentQuestion, answers, setCurrentQuestion, setAnswers, setIsCompleted, isLoading, isCompleted} = useDeepResearchStore()

    const currentQ = questions[currentQuestion];

    function selectAnswer(option: string) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = option;
      setAnswers(newAnswers);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setIsCompleted(true);
      }
    }

    if (isCompleted) return;
    if (questions.length === 0 || !currentQ) return;

    const selectedAnswer = answers[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Card className="w-full max-w-[90vw] sm:max-w-[80vw] xl:max-w-[50vw] bg-card border border-border/80 shadow-sm rounded-2xl animate-scale-in">
      <CardHeader className="px-6 sm:px-8 pt-7 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
            Clarifying Question
          </CardTitle>
          <span className="text-xs font-mono font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
            {currentQuestion + 1} / {questions.length}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 w-full px-6 sm:px-8 pb-8">
        <p className="text-lg font-medium text-foreground leading-relaxed font-body">
          {currentQ.question}
        </p>

        <div className="flex flex-col gap-2">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedAnswer === option;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => selectAnswer(option)}
                disabled={isLoading}
                className={`
                  group flex items-center gap-4 w-full text-left px-5 py-4 rounded-xl border text-sm font-medium leading-snug
                  transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20
                  ${isSelected
                    ? "border-primary/40 bg-primary/[0.04] text-primary shadow-sm"
                    : "border-border/60 bg-card text-foreground hover:bg-muted/50 hover:border-border"
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                <span
                  className={`
                    flex items-center justify-center w-7 h-7 rounded-lg border text-xs font-semibold shrink-0 transition-all duration-200
                    ${isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border/80 bg-background text-muted-foreground group-hover:border-border"
                    }
                  `}
                >
                  {isSelected ? <Check className="w-4 h-4" /> : String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1">{option}</span>
              </button>
            );
          })}
        </div>

        <div className="flex justify-between items-center pt-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              if (currentQuestion > 0) {
                setCurrentQuestion(currentQuestion - 1);
              }
            }}
            disabled={currentQuestion === 0}
            className="text-muted-foreground hover:text-foreground gap-1.5"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          {selectedAnswer && (
            <span className="text-xs text-muted-foreground">
              Selected: <span className="text-foreground font-medium">{selectedAnswer}</span>
            </span>
          )}
        </div>

        {/* Progress */}
        <div className="pt-2">
          <div className="flex justify-between text-xs text-muted-foreground mb-2.5">
            <span className="font-medium">Progress</span>
            <span className="font-mono">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default QuestionForm