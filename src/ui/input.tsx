"use client";

import { cn } from "./cn";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-lg border border-border bg-bg px-4 py-3 text-foreground placeholder:text-muted focus:border-violet-600 focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}
