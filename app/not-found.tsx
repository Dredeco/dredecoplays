import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl font-black text-violet-800/30 leading-none mb-4">
        404
      </div>
      <h1 className="text-3xl font-extrabold text-foreground mb-3">
        Página não encontrada
      </h1>
      <p className="text-muted text-lg mb-8 max-w-md">
        O jogo que você estava procurando não existe ou foi removido. Que tal
        explorar outros conteúdos?
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          href="/"
          className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Voltar para home
        </Link>
        <Link
          href="/blog"
          className="bg-surface-2 hover:bg-border text-foreground font-semibold px-6 py-3 rounded-lg border border-border transition-colors"
        >
          Ver todos os posts
        </Link>
      </div>
    </div>
  );
}
