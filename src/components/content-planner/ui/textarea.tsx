"use client";
import * as React from "react";
import { cn } from "@/lib/content-planner/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[80px] w-full rounded-xl border border-border/80 dark:border-white/10 bg-white/40 dark:bg-[#0a1128]/40 px-3 py-2 text-sm placeholder:text-muted-foreground/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/20 focus-visible:border-violet-500 disabled:cursor-not-allowed disabled:opacity-50 text-foreground transition-all",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
