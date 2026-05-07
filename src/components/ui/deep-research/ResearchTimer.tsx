"use client"

import { useEffect, useState } from "react"
import { useDeepResearchStore } from "@/store/deepResearch"
import { Clock } from "lucide-react"

function ResearchTimer() {
  const { report, activities } = useDeepResearchStore()
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    if (activities.length <= 0) return
    if (report.length > 10) return

    const startTime = Date.now()

    const timer = setInterval(() => {
      setElapsedTime(Date.now() - startTime)
    }, 16)

    return () => clearInterval(timer)
  }, [report, activities])

  if (activities.length <= 0) return null

  const seconds = Math.floor(elapsedTime / 1000)
  const milliseconds = elapsedTime % 1000

  return (
    <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-card border border-border/80 rounded-xl shadow-sm">
      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
      <span className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
        Elapsed
      </span>
      <span className="font-mono text-sm font-medium text-foreground tabular-nums">
        {seconds > 60
          ? `${Math.floor(seconds / 60)}m ${seconds % 60 > 0 ? `${(seconds % 60).toString().padStart(2, "0")}s` : ""}`
          : `${seconds}.${milliseconds.toString().padStart(3, "0")}s`}
      </span>
    </div>
  )
}
export default ResearchTimer