"use client";

import { cn } from "./cn";

export function FormLabel({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("mb-1 block text-sm font-medium text-gray-300", className)}
      {...props}
    />
  );
}

export function FormFieldError({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("mt-1 text-sm text-red-400", className)} {...props} />
  );
}
