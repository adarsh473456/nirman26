import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const base = "inline-flex items-center justify-center rounded-xl text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 disabled:pointer-events-none disabled:opacity-50";
    
    let variantStyles = "bg-zinc-50 text-zinc-950 hover:bg-zinc-200 shadow-md";
    if (variant === "outline") {
      variantStyles = "border border-zinc-800 bg-zinc-950/80 text-zinc-100 hover:bg-zinc-900 hover:border-zinc-700";
    } else if (variant === "secondary") {
      variantStyles = "bg-zinc-800 text-zinc-100 hover:bg-zinc-700";
    } else if (variant === "ghost") {
      variantStyles = "hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100";
    } else if (variant === "link") {
      variantStyles = "text-brand-400 underline-offset-4 hover:underline";
    }

    let sizeStyles = "h-10 px-4 py-2";
    if (size === "sm") sizeStyles = "h-8 px-3 text-[11px]";
    if (size === "lg") sizeStyles = "h-12 px-8 text-sm";
    if (size === "icon") sizeStyles = "h-9 w-9 p-0";

    return (
      <button
        className={cn(base, variantStyles, sizeStyles, className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
