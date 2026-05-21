import * as React from "react";
import { cn } from "@/lib/content-planner/utils";

export const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("relative bg-white/70 dark:bg-[#131a30]/70 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-xl rounded-2xl overflow-hidden transition-all duration-300", className)} {...props} />
);
export const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-5 border-b border-white/10 dark:border-white/5", className)} {...props} />
);
export const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-5", className)} {...props} />
);
export const CardFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-5 border-t border-white/10 dark:border-white/5", className)} {...props} />
);
