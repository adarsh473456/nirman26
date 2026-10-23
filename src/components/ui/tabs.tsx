import * as React from "react";
import { cn } from "../../lib/utils";

interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextType | undefined>(undefined);

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export function Tabs({
  defaultValue,
  value: controlledValue,
  onValueChange,
  className,
  children,
  ...props
}: TabsProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue || "");
  const value = controlledValue !== undefined ? controlledValue : uncontrolledValue;

  const handleValueChange = React.useCallback(
    (val: string) => {
      if (controlledValue === undefined) {
        setUncontrolledValue(val);
      }
      onValueChange?.(val);
    },
    [controlledValue, onValueChange]
  );

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-xl bg-zinc-950 p-1 text-zinc-400 border border-zinc-800",
        className
      )}
      {...props}
    />
  );
}

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export function TabsTrigger({ value, className, ...props }: TabsTriggerProps) {
  const context = React.useContext(TabsContext);
  const isSelected = context?.value === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isSelected}
      data-state={isSelected ? "active" : "inactive"}
      onClick={() => context?.onValueChange(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-bold ring-offset-zinc-950 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 disabled:pointer-events-none disabled:opacity-50",
        isSelected
          ? "bg-zinc-900 text-zinc-50 shadow-sm border border-zinc-700/60"
          : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50",
        className
      )}
      {...props}
    />
  );
}

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  forceMount?: boolean;
}

export function TabsContent({ value, forceMount, className, children, ...props }: TabsContentProps) {
  const context = React.useContext(TabsContext);
  const isSelected = context?.value === value;

  if (!isSelected && !forceMount) return null;

  return (
    <div
      role="tabpanel"
      data-state={isSelected ? "active" : "inactive"}
      className={cn("focus-visible:outline-none", className)}
      {...props}
    >
      {children}
    </div>
  );
}
