'use client'
import { useDeepResearchStore } from '@/store/deepResearch'
import React from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import { MessageSquare } from "lucide-react";

const CompletedQuestions = () => {
    const {questions, answers, isCompleted} = useDeepResearchStore();

    if(!isCompleted || questions.length === 0) return null;
    return (
        <Accordion type="single" collapsible className="w-full max-w-[90vw] sm:max-w-[80vw] xl:max-w-[50vw] bg-card border border-border/80 shadow-sm rounded-2xl animate-fade-in-up">
          <AccordionItem value="item-0" className="border-0">
            <AccordionTrigger className="px-6 sm:px-8 py-6 text-sm font-semibold tracking-widest uppercase text-muted-foreground hover:no-underline hover:bg-muted/40 rounded-2xl transition-colors">
              <span className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4" />
                Clarifying Questions & Responses
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-6 sm:px-8 pb-6">
              <div className="space-y-1">
                <Accordion type="single" collapsible className="w-full">
                  {questions.map((question, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border-b border-border/50 last:border-0">
                      <AccordionTrigger className="text-left hover:no-underline py-4 text-sm font-medium text-foreground/80 font-body">
                        <span className="pr-4">
                          {index + 1}. {question.question}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pb-4">
                        <div className="bg-muted/50 border border-border/50 rounded-xl p-4">
                          <p className="text-sm text-foreground/80 leading-relaxed font-body">{answers[index]}</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )
    }

export default CompletedQuestions