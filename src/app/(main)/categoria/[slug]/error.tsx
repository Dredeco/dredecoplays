"use client";

import Link from "next/link";
import { useEffect } from "react";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CategoryError({ error, reset }: Props) {
  useEffect(() => {
    console.error("[CategoryError]", error);
  }, [error]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
      <p className="text-5xl mb-4">🎮</p>
      <h2 className="text-2xl font-bold text-foreground mb-2">
        Não foi possível carregar esta categoria
      </h2>
      <p className="text-muted mb-6">
        A API pode estar instável. Tente novamente em alguns instantes.
      </p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={reset}
          className="px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium"
        >
          Tentar novamente
        </button>
        <Link
          href="/blog"
          className="px-5 py-2 rounded-lg bg-surface-2 border border-border text-foreground hover:text-foreground"
        >
          Ver todos os posts
        </Link>
      </div>
    </div>
  );
}
