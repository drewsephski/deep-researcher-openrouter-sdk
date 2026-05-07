'use client'
import { useDeepResearchStore } from '@/store/deepResearch'
import React, { useState } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from '../button'
import { ChevronDown, Activity, Link2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {format} from "date-fns"
import Link from 'next/link'

const ResearchActivities = () => {
const {activities, sources} = useDeepResearchStore();
const [isOpen, setIsOpen] = useState(true)

if (activities.length === 0) return;

  return (
    <div className="w-[90vw] sm:w-[440px] fixed top-4 right-4 z-20 animate-fade-in">
      <Collapsible className="w-full" open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex justify-end mb-2">
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="w-9 h-9 p-0 bg-card border-border/80 shadow-sm hover:bg-accent rounded-xl">
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="h-[50vh]">
          <Tabs defaultValue="activities" className="w-full h-full">
            <TabsList className="w-full h-11 bg-muted/80 border border-border/80 p-1 rounded-xl">
              <TabsTrigger value="activities" className="flex-1 gap-1.5 text-xs font-semibold tracking-wide uppercase data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-lg">
                <Activity className="w-3.5 h-3.5" />
                Activity Log
              </TabsTrigger>
              {sources.length > 0 && (
                <TabsTrigger value="sources" className="flex-1 gap-1.5 text-xs font-semibold tracking-wide uppercase data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-lg">
                  <Link2 className="w-3.5 h-3.5" />
                  Sources
                </TabsTrigger>
              )}
            </TabsList>
            <TabsContent
              value="activities"
              className="h-[calc(100%-48px)] overflow-y-auto bg-card border border-border/80 shadow-sm rounded-xl mt-2"
            >
              <ul className="divide-y divide-border/50">
                {activities.map((activity, index) => (
                  <li key={index} className="flex items-start gap-3 px-5 py-3.5 text-sm">
                    <span
                      className={`mt-1 min-w-[6px] h-[6px] rounded-full ${
                        activity.status === "complete"
                          ? "bg-emerald-500"
                          : activity.status === "error"
                            ? "bg-red-400"
                            : "bg-amber-400"
                      }`}
                    />
                    <div className="flex flex-col gap-1 min-w-0">
                      <p className="text-foreground/90 leading-snug font-medium">
                        {activity.message.includes("https://")
                          ? activity.message.split("https://")[0] +
                            activity.message.split("https://")[1].split("/")[0]
                          : activity.message}
                      </p>
                      {activity.timestamp && (
                        <span className="text-[11px] font-mono text-muted-foreground">
                          {format(activity.timestamp, "HH:mm:ss")}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </TabsContent>
            {sources.length > 0 && (
              <TabsContent
                value="sources"
                className="h-[calc(100%-48px)] overflow-y-auto bg-card border border-border/80 shadow-sm rounded-xl mt-2"
              >
                <ul className="divide-y divide-border/50">
                  {sources.map((source, index) => {
                    return (
                      <li key={index} className="px-5 py-3">
                        <Link
                          href={source.url}
                          target="_blank"
                          className="text-sm font-medium text-primary hover:text-primary/80 underline underline-offset-2 decoration-primary/20 hover:decoration-primary/60 transition-colors"
                        >
                          {source.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </TabsContent>
            )}
          </Tabs>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export default ResearchActivities