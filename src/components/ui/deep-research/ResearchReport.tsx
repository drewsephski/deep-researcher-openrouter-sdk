"use client";
import { useDeepResearchStore } from "@/store/deepResearch";
import React, { ComponentPropsWithRef } from "react";
import { Card } from "../card";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Prism as SyntaxHighlighter,
  SyntaxHighlighterProps,
} from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Download, FileText } from "lucide-react";
import { Button } from "../button";

type CodeProps = ComponentPropsWithRef<"code"> & {
  inline?: boolean;
};

const ResearchReport = () => {
  const { report, isCompleted, isLoading, topic } = useDeepResearchStore();

  const handleMarkdownDownload = () => {
    const content = report.split("<report>")[1].split("</report>")[0];
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${topic}-research-report.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isCompleted) return null;

  if (report.length <= 0 && isLoading) {
    return (
      <div className="w-full max-w-[90vw] xl:max-w-[60vw] flex flex-col items-start gap-6 py-8 animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
          <span className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
            Research in progress
          </span>
        </div>
        <div className="w-full h-px bg-border/60" />
      </div>
    );
  }

  if (report.length <= 0) return null;

  return (
    <Card className="w-full max-w-[90vw] xl:max-w-[60vw] bg-card border border-border/80 shadow-sm rounded-2xl relative animate-fade-in-up">
      <div className="flex items-center justify-between px-6 sm:px-8 py-6 border-b border-border/60">
        <div className="flex items-center gap-2.5">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">
            Research Report
          </h2>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="flex items-center gap-2 rounded-xl text-xs font-medium tracking-wide border-border/80 hover:bg-muted/50"
          onClick={handleMarkdownDownload}
        >
          <Download className="w-3.5 h-3.5" />
          Download
        </Button>
      </div>

      <div className="prose prose-sm md:prose-base max-w-none px-6 sm:px-8 py-8 overflow-x-auto font-body">
        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ className, children, inline, ...props }: CodeProps) {
              const match = /language-(\w+)/.exec(className || "");
              const language = match ? match[1] : "";

              if (!inline && language) {
                const SyntaxHighlighterProps: SyntaxHighlighterProps = {
                  style: oneLight,
                  language,
                  PreTag: "div",
                  children: String(children).replace(/\n$/, ""),
                };

                return <SyntaxHighlighter {...SyntaxHighlighterProps} />;
              }

              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {report.split("<report>")[1].split("</report>")[0]}
        </Markdown>
      </div>
    </Card>
  );
};

export default ResearchReport;
