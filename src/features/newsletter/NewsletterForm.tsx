"use client";

import { useState, FormEvent } from "react";

export type NewsletterFormVariant = "inline" | "compact";

interface Props {
  variant: NewsletterFormVariant;
  /** Para variant inline: gradient = texto claro (banner); default = tema do site (modal) */
  inlineTheme?: "gradient" | "default";
  /** @deprecated Preferir tema via html.light; mantido para compatibilidade */
  darkFooter?: boolean;
  /** Chamado após inscrição bem-sucedida (ex.: fechar pop-up) */
  onSuccess?: () => void;
  className?: string;
}

const STORAGE_KEY = "newsletter_subscribed";

export function markNewsletterSubscribed() {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, "1");
    }
  } catch {
    // ignore
  }
}

export function isNewsletterSubscribed(): boolean {
  try {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export default function NewsletterForm({
  variant,
  inlineTheme = "gradient",
  darkFooter = false,
  onSuccess,
  className = "",
}: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setStatus("error");
      setErrorMessage("Digite seu e-mail.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        error?: string;
      };

      if (!res.ok || !data.success) {
        setStatus("error");
        setErrorMessage(data.error || "Algo deu errado. Tente de novo.");
        return;
      }

      markNewsletterSubscribed();
      setStatus("success");
      setEmail("");
      if (onSuccess) {
        window.setTimeout(() => onSuccess(), 450);
      }
    } catch {
      setStatus("error");
      setErrorMessage("Erro de conexão. Verifique sua internet.");
    }
  }

  if (status === "success") {
    return (
      <p
        className={`text-sm font-medium text-emerald-400 ${className}`}
        role="status"
      >
        Inscrição confirmada! Confira sua caixa de entrada.
      </p>
    );
  }

  const inputClass =
    "flex-1 min-w-0 bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-violet-600 transition-colors";

  const inlineInputClass =
    inlineTheme === "gradient"
      ? "flex-1 min-w-0 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-base text-white placeholder:text-white/50 focus:outline-none focus:border-white/40 transition-colors"
      : inputClass + " sm:flex-1 py-3 px-4 text-base";

  const inlineButtonClass =
    inlineTheme === "gradient"
      ? "shrink-0 bg-white text-violet-900 hover:bg-violet-100 disabled:opacity-60 font-bold px-8 py-3 rounded-xl text-base transition-colors shadow-lg"
      : "shrink-0 bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-60 font-bold px-8 py-3 rounded-xl text-base transition-colors";

  const legalClass =
    inlineTheme === "gradient"
      ? "text-xs text-white/60"
      : "text-xs text-muted";

  const legalLinkClass =
    inlineTheme === "gradient"
      ? "underline hover:text-white"
      : "text-violet-400 underline hover:text-violet-300";

  const compactFooterInputClass =
    "min-w-0 flex-1 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-colors focus:border-[var(--color-brand-violet)] focus:outline-none";
  const compactFooterButtonClass =
    "shrink-0 rounded-lg bg-[var(--color-brand-violet)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-brand-violet-light)] disabled:opacity-60";

  if (variant === "compact") {
    return (
      <form onSubmit={handleSubmit} className={`space-y-2 ${className}`}>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
          <label htmlFor="newsletter-email-footer" className="sr-only">
            E-mail para newsletter
          </label>
          <input
            id="newsletter-email-footer"
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            disabled={status === "loading"}
            className={darkFooter ? compactFooterInputClass : inputClass}
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className={
              darkFooter
                ? compactFooterButtonClass
                : "shrink-0 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-500 disabled:opacity-60"
            }
          >
            {status === "loading" ? "…" : "Inscrever"}
          </button>
        </div>
        {status === "error" && (
          <p className="text-xs text-red-400" role="alert">
            {errorMessage}
          </p>
        )}
      </form>
    );
  }

  // inline
  return (
    <form onSubmit={handleSubmit} className={`space-y-3 ${className}`}>
      <label htmlFor="newsletter-email-inline" className="sr-only">
        E-mail para newsletter
      </label>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          id="newsletter-email-inline"
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite seu melhor e-mail"
          disabled={status === "loading"}
          className={inlineInputClass}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={inlineButtonClass}
        >
          {status === "loading" ? "Enviando…" : "Quero receber"}
        </button>
      </div>
      {status === "error" && (
        <p
          className={
            inlineTheme === "gradient"
              ? "text-sm text-red-300"
              : "text-sm text-red-400"
          }
          role="alert"
        >
          {errorMessage}
        </p>
      )}
      <p className={legalClass}>
        Sem spam. Cancele quando quiser. Ao inscrever, você concorda com nossa{" "}
        <a href="/politica-de-privacidade" className={legalLinkClass}>
          Política de Privacidade
        </a>
        .
      </p>
    </form>
  );
}
