"use client";

import { Button } from "@ui/button";

export type FriendlyErrorDialogProps = {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
};

export function FriendlyErrorDialog({
  open,
  title,
  message,
  onClose,
}: FriendlyErrorDialogProps) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="friendly-error-title"
    >
      <div className="w-full max-w-md rounded-xl border border-border bg-bg p-6 shadow-xl">
        <h2 id="friendly-error-title" className="text-lg font-semibold text-white">
          {title}
        </h2>
        <p className="mt-2 text-sm text-muted">{message}</p>
        <div className="mt-6 flex justify-end">
          <Button type="button" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
