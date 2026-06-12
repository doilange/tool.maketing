"use client";
import * as React from "react";
import { cn } from "@/lib/content-planner/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-foreground transition-colors placeholder:text-muted-foreground/50 focus-visible:border-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-[#0b1220]",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
