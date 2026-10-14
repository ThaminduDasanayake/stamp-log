import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-tight transition-colors focus:outline-none focus:ring-1 focus:ring-[#0070f3]",
  {
    variants: {
      variant: {
        default:
          "border-[#ebebeb] dark:border-[#262626] bg-[#fafafa] dark:bg-[#111111] text-[#171717] dark:text-[#ededed]",
        secondary:
          "border-transparent bg-[#f5f5f5] dark:bg-[#1f1f1f] text-[#666666] dark:text-[#888888]",
        outline:
          "border-[#ebebeb] dark:border-[#262626] bg-transparent text-[#171717] dark:text-[#ededed]",
        exec: "border-[#bd5200]/25 bg-[#bd5200]/8 text-[#bd5200] dark:text-[#f5a623] dark:border-[#f5a623]/30",
        user: "border-[#00876c]/25 bg-[#50e3c2]/10 text-[#00876c] dark:text-[#50e3c2] dark:border-[#50e3c2]/30",
        dev: "border-[#0070f3]/25 bg-[#0070f3]/8 text-[#0070f3] dark:text-[#3291ff] dark:border-[#0070f3]/30",
        purple:
          "border-[#7928ca]/25 bg-[#7928ca]/8 text-[#7928ca] dark:text-[#ab61e5] dark:border-[#7928ca]/30",
        destructive:
          "border-[#ee0000]/25 bg-[#ee0000]/8 text-[#ee0000] dark:text-[#ff3333] dark:border-[#ee0000]/30",
        pixel:
          "font-pixel rounded-[4px] border-[#171717] dark:border-[#ededed] bg-[#171717] text-white dark:bg-[#ededed] dark:text-[#171717] text-[10px] tracking-wider uppercase px-2 py-0.5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
