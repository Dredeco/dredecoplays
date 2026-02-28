import { getPublicProducts } from "@/lib/api";
import { shuffle } from "@/lib/utils";
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
      className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl bg-surface border border-border shadow-md hover:border-violet-600/50 transition-colors group"
    >
      <div className="h-20 w-full shrink-0 bg-surface-2 flex items-center justify-center p-2">
        {product.image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="text-muted text-xs">—</span>
        )}
      </div>
      <div className="flex min-h-0 flex-1 flex-col p-3">
        <h4 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-violet-300 transition-colors">
          {product.name}
        </h4>
        <div className="mt-1 flex flex-wrap items-baseline gap-1.5">
          <span className="text-cyan-400 font-bold text-sm">
            {formatPrice(product.price)}
          </span>
          {product.original_price != null &&
            product.original_price > product.price && (
              <span className="text-muted line-through text-xs">
                {formatPrice(product.original_price)}
              </span>
            )}
        </div>
        {product.rating != null && (
          <span className="text-yellow-400 mt-0.5 inline-block text-xs">
            ★ {Number(product.rating).toFixed(1)}
          </span>
        )}
        <span className="mt-2 px-3 py-1.5 text-center rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium transition-colors">
          Ver oferta
        </span>
      </div>
    </a>
  );
}

interface Props {
  className?: string;
}

export default async function ProductsGridAd({ className = "" }: Props) {
  const products = await getPublicProducts();
  const display = shuffle(products).slice(0, 6);

  if (display.length === 0) return null;

  return (
    <div
      className={`bg-surface rounded-xl border border-border shadow-md p-5 ${className}`}
    >
      <h3 className="text-foreground font-bold text-xs uppercase tracking-widest mb-4">
        Produtos Recomendados
      </h3>
      <div className="grid grid-cols-2 gap-3 items-stretch">
        {display.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
