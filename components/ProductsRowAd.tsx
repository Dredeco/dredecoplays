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
      className="flex flex-col min-w-[148px] max-w-[180px] shrink-0 rounded-xl bg-[#13131a] border border-[#2a2a3a] overflow-hidden hover:border-violet-600/50 transition-colors group"
    >
      <div className="h-36 w-full shrink-0 overflow-hidden bg-[#1c1c28] flex items-center justify-center p-3">
        {product.image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <span className="text-gray-600 text-xs">—</span>
        )}
      </div>
      <div className="p-3 flex-1 flex flex-col">
        <h4 className="text-sm font-medium text-white line-clamp-2 group-hover:text-violet-300 transition-colors">
          {product.name}
        </h4>
        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="text-cyan-400 font-bold text-sm">
            {formatPrice(product.price)}
          </span>
          {product.original_price != null && product.original_price > product.price && (
            <span className="text-gray-500 line-through text-xs">
              {formatPrice(product.original_price)}
            </span>
          )}
        </div>
        {product.rating != null && (
          <span className="text-yellow-400 text-xs mt-0.5">★ {Number(product.rating).toFixed(1)}</span>
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

export default async function ProductsRowAd({ className = "" }: Props) {
  const products = await getPublicProducts();
  const display = shuffle(products).slice(0, 6);

  if (display.length === 0) return null;

  return (
    <section className={className}>
      <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-4">
        Produtos Recomendados
      </h3>
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
        {display.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
