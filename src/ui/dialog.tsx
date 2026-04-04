"use client";

import { cn } from "./cn";

export type DialogProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  className,
}: DialogProps) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="presentation"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "dialog-title" : undefined}
        aria-describedby={description ? "dialog-desc" : undefined}
        className={cn(
          "w-full max-w-lg rounded-xl border border-border bg-bg p-6 shadow-xl outline-none",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title ? (
          <h2 id="dialog-title" className="text-lg font-semibold text-white">
            {title}
          </h2>
        ) : null}
        {description ? (
          <p id="dialog-desc" className="mt-1 text-sm text-muted">
            {description}
          </p>
        ) : null}
        <div className={title || description ? "mt-4" : ""}>{children}</div>
      </div>
    </div>
  );
}
