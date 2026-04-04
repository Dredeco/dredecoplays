import { getPublicProducts } from "@core/api-client";
import { shuffle } from "@core/utils";
import ProductAffiliateCard from "@features/products/ProductAffiliateCard";

interface Props {
  className?: string;
  /** Quando exibido dentro de um post, rastreia cliques com contexto */
  postId?: number;
  /** Sidebar estreita: uma coluna para evitar cards espremidos */
  layout?: "default" | "sidebar";
  /** Quantidade de produtos (default 6; sidebar costuma usar menos) */
  limit?: number;
}

export default async function ProductsGridAd({
  className = "",
  postId,
  layout = "default",
  limit = 6,
}: Props) {
  const products = await getPublicProducts();
  const display = shuffle(products).slice(0, Math.min(limit, 12));

  if (display.length === 0) return null;

  const isSidebar = layout === "sidebar";

  return (
    <div
      className={`rounded-xl border border-[var(--color-border-subtle)] bg-surface shadow-[var(--shadow-card)] ${isSidebar ? "p-4" : "p-5"} ${className}`}
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span
          className="rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]"
        >
          Afiliados
        </span>
        <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-foreground">
          Produtos Recomendados
        </h3>
      </div>
      <div
        className={`grid items-stretch ${isSidebar ? "grid-cols-1 gap-4" : "grid-cols-2 gap-3"}`}
      >
        {display.map((product) => (
          <ProductAffiliateCard
            key={product.id}
            product={product}
            postId={postId}
            variant="grid"
          />
        ))}
      </div>
    </div>
  );
}
