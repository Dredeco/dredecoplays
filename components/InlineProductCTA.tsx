"use client";

import type { Product } from "@/lib/types";
import AffiliateOutboundLink from "@/components/AffiliateOutboundLink";

function formatPrice(price: number): string {
  return `R$ ${Number(price).toFixed(2).replace(".", ",")}`;
}

interface Props {
  product: Product;
  postId?: number;
}

export default function InlineProductCTA({ product, postId }: Props) {
  const discount =
    product.original_price != null && product.original_price > product.price
      ? Math.round(
          (1 - Number(product.price) / Number(product.original_price)) * 100,
        )
      : null;

  return (
    <aside className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-surface to-violet-950/20 p-5 shadow-lg">
      <p className="text-xs font-bold uppercase tracking-widest text-violet-400">
        Oferta destacada
      </p>
      <div className="mt-3 flex gap-4">
        {product.image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={product.image}
            alt=""
            className="h-24 w-24 shrink-0 rounded-lg bg-surface-2 object-contain p-1"
          />
        ) : null}
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold leading-snug text-foreground">
            {product.name}
          </h3>
          <div className="mt-2 flex flex-wrap items-baseline gap-2">
            <span className="text-xl font-black text-cyan-400">
              {formatPrice(product.price)}
            </span>
            {product.original_price != null &&
              product.original_price > product.price && (
                <span className="text-sm text-muted line-through">
                  {formatPrice(product.original_price)}
                </span>
              )}
            {discount != null ? (
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-400">
                −{discount}%
              </span>
            ) : null}
          </div>
          {product.rating != null ? (
            <p className="mt-1 text-xs text-yellow-400">
              ★ {Number(product.rating).toFixed(1)}
            </p>
          ) : null}
        </div>
      </div>
      <AffiliateOutboundLink
        href={product.affiliate_url}
        productId={product.id}
        postId={postId}
        className="mt-4 flex w-full items-center justify-center rounded-xl bg-violet-600 py-3 text-sm font-bold text-white transition-colors hover:bg-violet-500"
      >
        Ver oferta
      </AffiliateOutboundLink>
    </aside>
  );
}
