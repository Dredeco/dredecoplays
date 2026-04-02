import { getPublicProducts } from "@/lib/api";
import { shuffle } from "@/lib/utils";
import ProductAffiliateCard from "@/components/ProductAffiliateCard";

interface Props {
  className?: string;
  /** Quando exibido dentro de um post, rastreia cliques com contexto */
  postId?: number;
}

export default async function ProductsGridAd({ className = "", postId }: Props) {
  const products = await getPublicProducts();
  const display = shuffle(products).slice(0, 6);

  if (display.length === 0) return null;

  return (
    <div
      className={`rounded-xl border border-[var(--color-border-subtle)] bg-surface p-5 shadow-[var(--shadow-card)] ${className}`}
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span
          className="rounded-md border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-brand-violet-light)]"
          aria-hidden
        >
          Dredeco
        </span>
        <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-foreground">
          Recomendado pela Redação
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-3 items-stretch">
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
