"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/content-planner/utils";

const buttonVariants = cva(
  "inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.99] select-none cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-violet-600 text-white shadow-sm hover:bg-violet-700 border border-violet-600",
        outline:
          "border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111827] text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-[#1f2937]",
        ghost: "hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 border border-transparent shadow-none",
        secondary: "bg-slate-100 hover:bg-slate-200 dark:bg-[#1f2937] dark:hover:bg-[#273449] text-slate-900 dark:text-slate-100 border border-transparent",
        destructive: "bg-rose-600 text-white hover:bg-rose-700 border border-rose-600",
        subtle: "bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-[#1f2937]",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-9 px-3 text-xs",
        lg: "h-11 px-5",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />
    );
  }
);
Button.displayName = "Button";
export { buttonVariants };
