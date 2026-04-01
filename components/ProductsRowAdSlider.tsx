import type { Product } from "@/lib/types";

function formatPrice(price: number): string {
  return `R$ ${Number(price).toFixed(2).replace(".", ",")}`;
}

function ProductCard({ product }: { product: Product }) {
  return (
    <a
      href={product.affiliate_url}
      target="_blank"
      rel="nofollow sponsored noopener noreferrer"
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-md transition-colors hover:border-violet-600/50"
    >
      <div className="flex h-24 w-full shrink-0 items-center justify-center bg-surface-2 p-2">
        {product.image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="text-xs text-muted">—</span>
        )}
      </div>
      <div className="flex min-h-0 flex-1 flex-col p-3">
        <h4 className="line-clamp-2 text-xs font-medium text-foreground transition-colors group-hover:text-violet-300 sm:text-sm">
          {product.name}
        </h4>
        <div className="mt-1 flex flex-wrap items-baseline gap-1">
          <span className="text-sm font-bold text-cyan-400">
            {formatPrice(product.price)}
          </span>
          {product.original_price != null &&
            product.original_price > product.price && (
              <span className="text-xs text-muted line-through">
                {formatPrice(product.original_price)}
              </span>
            )}
        </div>
        {product.rating != null && (
          <span className="mt-0.5 text-xs text-yellow-400">
            ★ {Number(product.rating).toFixed(1)}
          </span>
        )}
        <span className="mt-2 rounded-lg bg-violet-600 px-2.5 py-1.5 text-center text-[11px] font-medium text-white transition-colors hover:bg-violet-500 sm:text-xs">
          Ver oferta
        </span>
      </div>
    </a>
  );
}

interface Props {
  products: Product[];
}

export default function ProductsRowAdSlider({ products }: Props) {
  const list = products.length > 0 ? products : [];

  return (
    <div className="relative">
      <div
        className={
          "flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] " +
          "snap-x snap-mandatory " +
          "[&::-webkit-scrollbar]:hidden " +
          "lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:pb-0"
        }
        role="list"
        aria-label="Produtos recomendados"
      >
        {list.map((product) => (
          <div
            key={product.id}
            className="w-[min(72vw,260px)] shrink-0 snap-start lg:w-auto lg:min-w-0"
            role="listitem"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
