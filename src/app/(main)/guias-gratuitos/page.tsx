import type { Metadata } from "next";
import Link from "next/link";
import NewsletterForm from "@features/newsletter/NewsletterForm";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://dredecoplays.com.br";

export const metadata: Metadata = {
  title: "Guia grátis — 50 jogos para ficar de olho",
  description:
    "Baixe o resumo em PDF e receba por e-mail novidades, ofertas e listas curadas do Dredeco Plays.",
  alternates: { canonical: `${SITE_URL}/guias-gratuitos` },
  openGraph: {
    title: "Guia grátis — Dredeco Plays",
    description: "Lead magnet: PDF + newsletter semanal.",
    url: `${SITE_URL}/guias-gratuitos`,
    locale: "pt_BR",
    type: "website",
  },
};

export default function GuiasGratuitosPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-widest text-violet-400">
        Lead magnet
      </p>
      <h1 className="mt-2 text-3xl font-black text-foreground sm:text-4xl">
        Guia grátis: jogos que valem seu tempo em 2026
      </h1>
      <p className="mt-4 text-lg text-muted leading-relaxed">
        Cadastre seu e-mail e receba um PDF com uma seleção curada de títulos — além do
        resumo semanal com notícias e ofertas. Sem spam, só coisa boa.
      </p>

      <div className="mt-10 rounded-2xl border border-violet-500/30 bg-surface p-8 shadow-xl">
        <h2 className="text-lg font-bold text-foreground">Quero o guia + newsletter</h2>
        <p className="mt-2 text-sm text-muted">
          Ao confirmar, você aceita receber e-mails do Dredeco Plays (opt-out a qualquer
          momento).
        </p>
        <div className="mt-6">
          <NewsletterForm variant="inline" inlineTheme="default" />
        </div>
      </div>

      <p className="mt-10 text-center text-sm text-muted">
        <Link href="/politica-de-privacidade" className="underline hover:text-foreground">
          Política de privacidade
        </Link>
      </p>
    </div>
  );
}
