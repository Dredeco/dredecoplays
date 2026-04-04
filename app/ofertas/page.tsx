import type { Metadata } from "next";
import Link from "next/link";
import { getPublicProducts } from "@/lib/api";
import ProductAffiliateCard from "@/components/ProductAffiliateCard";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://dredecoplays.com.br";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Ofertas e melhores preços em games e hardware",
  description:
    "Ofertas selecionadas em jogos, consoles, periféricos e acessórios. Links de afiliado Dredeco Plays — sem custo extra para você.",
  alternates: { canonical: `${SITE_URL}/ofertas` },
  openGraph: {
    title: "Ofertas — Dredeco Plays",
    description: "Melhores preços em games e hardware para o jogador brasileiro.",
    url: `${SITE_URL}/ofertas`,
    locale: "pt_BR",
    type: "website",
  },
};

type SortKey = "discount" | "price_asc" | "price_desc";

interface Props {
  searchParams: Promise<{ categoria?: string; ordenar?: SortKey }>;
}

export default async function OfertasPage({ searchParams }: Props) {
  const sp = await searchParams;
  const ordenar =
    sp.ordenar === "price_asc" || sp.ordenar === "price_desc"
      ? sp.ordenar
      : "discount";
  const categoria = sp.categoria?.trim() || undefined;

  const sortParam =
    ordenar === "price_asc" || ordenar === "price_desc" || ordenar === "discount"
      ? ordenar
      : "discount";

  const [catalog, products] = await Promise.all([
    getPublicProducts({ sort: "discount" }),
    getPublicProducts({
      category: categoria,
      sort: sortParam,
    }),
  ]);

  const categories = [
    ...new Set(
      catalog
        .map((p) => p.category)
        .filter((c): c is string => Boolean(c && c.trim())),
    ),
  ].sort();

  function buildHref(opts: { cat?: string | null; ord?: SortKey }): string {
    const p = new URLSearchParams();
    const cat =
      opts.cat === null ? undefined : opts.cat !== undefined ? opts.cat : categoria;
    const ord = opts.ord !== undefined ? opts.ord : ordenar;
    if (cat?.trim()) p.set("categoria", cat.trim());
    if (ord && ord !== "discount") p.set("ordenar", ord);
    const s = p.toString();
    return s ? `/ofertas?${s}` : "/ofertas";
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <header className="mb-10 max-w-3xl">
        <p className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-400">
          <span aria-hidden>🏷️</span>
          Monetização ética
        </p>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          Ofertas em games e hardware
        </h1>
        <p className="mt-3 text-[var(--color-text-secondary)] leading-relaxed">
          Selecionamos produtos com bom custo-benefício. Ao comprar pelos links,
          o Dredeco recebe uma comissão — você não paga nada a mais.
        </p>
      </header>

      <div className="sort-controls mb-8 flex flex-wrap items-center gap-2">
        <span className="text-sm text-[var(--color-text-muted)]">Ordenar:</span>
        {(
          [
            ["discount", "Maior desconto"],
            ["price_asc", "Menor preço"],
            ["price_desc", "Maior preço"],
          ] as const
        ).map(([key, label]) => (
          <Link
            key={key}
            href={buildHref({ ord: key })}
            className={`sort-btn rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              ordenar === key
                ? "bg-[var(--color-brand-primary)] text-white ring-0 border-transparent"
                : "border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-brand-primary)]/50 hover:text-foreground"
            }`}
            data-active={ordenar === key ? true : undefined}
          >
            {label}
          </Link>
        ))}
      </div>

      {categories.length > 0 ? (
        <div className="mb-10 flex flex-wrap gap-2">
          <Link
            href={buildHref({ cat: null })}
            className={`rounded-lg px-3 py-1 text-sm ${
              !categoria ? "bg-violet-600 text-white" : "bg-surface text-muted hover:text-foreground"
            }`}
          >
            Todas
          </Link>
          {categories.map((c) => (
            <Link
              key={c}
              href={buildHref({ cat: c })}
              className={`rounded-lg px-3 py-1 text-sm ${
                categoria === c
                  ? "bg-violet-600 text-white"
                  : "bg-surface text-muted hover:text-foreground"
              }`}
            >
              {c}
            </Link>
          ))}
        </div>
      ) : null}

      {products.length === 0 ? (
        <p className="text-muted">Nenhum produto ativo no momento.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
          {products.map((p) => {
            const disc =
              p.original_price != null && p.original_price > p.price
                ? Math.round(
                    (1 - Number(p.price) / Number(p.original_price)) * 100,
                  )
                : null;
            return (
              <li key={p.id}>
                <div className="relative h-full">
                  {disc != null ? (
                    <span className="discount-badge absolute left-3 top-3 z-10 rounded-full bg-[var(--color-positive)] px-2 py-0.5 text-xs font-bold text-white shadow-sm">
                      −{disc}%
                    </span>
                  ) : null}
                  <ProductAffiliateCard product={p} variant="grid" />
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <p className="mt-12 text-xs text-muted" suppressHydrationWarning>
        Preços e disponibilidade podem mudar. Consultado em{" "}
        {new Date().toLocaleDateString("pt-BR")}
        .
      </p>
    </div>
  );
}
