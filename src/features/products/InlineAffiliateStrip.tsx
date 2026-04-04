import ProductAffiliateCard from "@features/products/ProductAffiliateCard";
import type { Product } from "@core/types";

interface Props {
  products: Product[];
  postId?: number;
}

/** Faixa de produtos afiliados dentro do corpo do artigo (not-prose). */
export default function InlineAffiliateStrip({ products, postId }: Props) {
  if (products.length === 0) return null;

  return (
    <aside
      className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] p-4 shadow-[var(--shadow-card)] sm:p-5"
      aria-label="Produtos recomendados"
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
          Afiliados
        </span>
        <span className="text-xs font-semibold text-foreground">
          Ofertas selecionadas
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {products.map((product) => (
          <ProductAffiliateCard
            key={product.id}
            product={product}
            postId={postId}
            variant="grid"
          />
        ))}
      </div>
    </aside>
  );
}
