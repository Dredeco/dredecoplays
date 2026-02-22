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
        <h2 className="text-2xl font-bold text-white mb-2">Algo deu errado</h2>
        <p className="text-gray-400 mb-6">
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
            className="px-5 py-2 rounded-lg bg-[#1c1c28] border border-[#2a2a3a] text-gray-300 hover:text-white"
          >
            Ir para o início
          </Link>
        </div>
      </div>
    </div>
  );
}
