"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/content-planner/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] shadow-sm select-none cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-brand-gradient text-white shadow-md shadow-violet-500/10 hover:opacity-95 hover:shadow-violet-500/20 border-none",
        outline:
          "border border-white/20 dark:border-white/10 bg-white/40 dark:bg-[#1c2541]/40 text-violet-600 dark:text-violet-400 hover:bg-white/80 dark:hover:bg-[#1c2541]/60",
        ghost: "hover:bg-white/40 dark:hover:bg-white/5 text-violet-600 dark:text-violet-400 border-none shadow-none",
        secondary: "bg-white/50 hover:bg-white/80 dark:bg-[#1c2541]/40 dark:hover:bg-[#1c2541]/60 text-foreground border border-white/10 dark:border-white/5",
        destructive: "bg-rose-500 text-white hover:bg-rose-600 border-none",
        subtle: "bg-white/30 dark:bg-black/20 border border-white/10 backdrop-blur text-foreground hover:bg-white/40",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 px-3 text-xs",
        lg: "h-11 px-6",
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
