import { getPublicProducts } from "@core/api-client";
import { shuffle } from "@core/utils";
import ProductsRowAdSlider from "@features/products/ProductsRowAdSlider";

interface Props {
  className?: string;
  postId?: number;
}

export default async function ProductsRowAd({ className = "", postId }: Props) {
  const products = await getPublicProducts();
  const display = shuffle(products).slice(0, 8);

  if (display.length === 0) return null;

  return (
    <section className={className} aria-labelledby="products-row-heading">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
          Afiliados
        </span>
        <h3
          id="products-row-heading"
          className="text-sm font-bold uppercase tracking-[0.12em] text-foreground"
        >
          Produtos Recomendados
        </h3>
      </div>
      <ProductsRowAdSlider products={display} postId={postId} />
    </section>
  );
}
