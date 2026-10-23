import * as React from "react";
import { cn } from "../../lib/utils";
import { Check } from "lucide-react";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="checkbox"
        ref={ref}
        className={cn(
          "h-4 w-4 rounded-md border-zinc-700 bg-zinc-950 text-brand-500 focus:ring-brand-400 focus:ring-offset-zinc-900 accent-brand-500 cursor-pointer",
          className
        )}
        {...props}
      />
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
