import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0070f3] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#171717] text-white border border-[#171717] shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_1px_1px_0_rgba(0,0,0,0.02),0_4px_8px_0_rgba(0,0,0,0.04)] hover:bg-[#262626] dark:bg-white dark:text-[#171717] dark:border-white dark:hover:bg-[#ededed]",
        secondary:
          "bg-white dark:bg-[#0a0a0a] text-[#171717] dark:text-[#ededed] border border-[#ebebeb] dark:border-[#262626] shadow-[0_1px_2px_0_rgba(0,0,0,0.04)] hover:bg-[#fafafa] dark:hover:bg-[#171717] hover:border-[#8f8f8f]",
        outline:
          "bg-transparent text-[#171717] dark:text-[#ededed] border border-[#ebebeb] dark:border-[#262626] hover:bg-[#fafafa] dark:hover:bg-[#141414] hover:text-black dark:hover:text-white",
        ghost:
          "bg-transparent text-[#4d4d4d] dark:text-[#a1a1aa] hover:text-[#171717] dark:hover:text-white hover:bg-[#f5f5f5] dark:hover:bg-[#1a1a1a]",
        vercel:
          "bg-[#0070f3] text-white border border-[#0070f3] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] hover:bg-[#0060df] dark:hover:bg-[#0060df]",
        destructive:
          "bg-[#ee0000] text-white border border-[#ee0000] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] hover:bg-[#cc0000]",
        link: "text-[#0070f3] underline-offset-4 hover:underline p-0 h-auto font-normal",
      },
      size: {
        default: "h-9 px-4 py-2 rounded-[4px] text-xs font-medium",
        sm: "h-8 px-3 text-xs rounded-[4px]",
        lg: "h-10 px-5 text-sm rounded-[4px]",
        pill: "h-8 px-4 text-xs rounded-full",
        icon: "h-8 w-8 rounded-[4px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
