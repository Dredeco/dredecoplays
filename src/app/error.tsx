"use client";

import Link from "next/link";
import { useEffect } from "react";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-5xl mb-4">⚠️</p>
        <h2 className="text-2xl font-bold text-foreground mb-2">Algo deu errado</h2>
        <p className="text-muted mb-6">
          Não conseguimos carregar esta página. Pode ser uma instabilidade temporária da API.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium"
          >
            Tentar novamente
          </button>
          <Link
            href="/"
            className="px-5 py-2 rounded-lg bg-surface-2 border border-border text-foreground hover:text-foreground"
          >
            Ir para o início
          </Link>
        </div>
      </div>
    </div>
  );
}
