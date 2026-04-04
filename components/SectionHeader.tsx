import Link from "next/link";
import type { ReactNode } from "react";

interface Props {
  label: string;
  id?: string;
  href?: string;
  linkText?: string;
  /** Conteúdo extra à direita (ex.: badge) */
  end?: ReactNode;
}

export default function SectionHeader({
  label,
  id,
  href,
  linkText = "Ver todos →",
  end,
}: Props) {
  const showActions = Boolean(href || end);

  return (
    <div className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-4 border-l-[3px] border-[var(--color-brand-primary)] pl-4">
      <h2
        id={id}
        className="min-w-0 flex-1 text-[length:var(--text-2xl)] font-bold leading-[var(--leading-snug)] tracking-[var(--tracking-tight)] text-foreground"
      >
        {label}
      </h2>
      {showActions ? (
        <div className="flex flex-wrap items-center gap-3 sm:ml-auto">
          {end}
          {href ? (
            <Link
              href={href}
              className="text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-brand-primary)]"
            >
              {linkText}
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
