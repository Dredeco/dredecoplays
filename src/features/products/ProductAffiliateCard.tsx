"use client";

import type { Product } from "@core/types";
import AffiliateOutboundLink from "@features/products/AffiliateOutboundLink";

function formatPrice(price: number): string {
  return `R$ ${Number(price).toFixed(2).replace(".", ",")}`;
}

function StarRating({ rating }: { rating: number }) {
  const r = Math.min(5, Math.max(0, Number(rating)));
  return (
    <div
      className="flex items-center gap-0.5 text-[var(--color-brand-accent)]"
      role="img"
      aria-label={`Nota ${r.toFixed(1)} de 5`}
    >
      <span aria-hidden className="text-sm font-bold">
        ★
      </span>
      <span className="text-xs font-semibold tabular-nums">{r.toFixed(1)}</span>
    </div>
  );
}

interface Props {
  product: Product;
  postId?: number;
  variant?: "grid" | "row";
}

export default function ProductAffiliateCard({
  product,
  postId,
  variant = "grid",
}: Props) {
  const hasDiscount =
    product.original_price != null && product.original_price > product.price;

  return (
    <AffiliateOutboundLink
      href={product.affiliate_url}
      productId={product.id}
      postId={postId}
      data-variant={variant}
      className="group flex h-full min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] shadow-[var(--shadow-card)] transition-[border-color,box-shadow] duration-[var(--transition-base)] hover:border-[var(--color-border-default)] hover:shadow-[var(--shadow-elevated)]"
    >
      <div className="flex h-[120px] w-full shrink-0 items-center justify-center rounded-t-[var(--radius-lg)] bg-white p-2">
        {product.image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={product.image}
            alt={product.name}
            width={200}
            height={120}
            className="h-full w-full max-h-[104px] object-contain"
          />
        ) : (
          <span className="text-xs text-muted">—</span>
        )}
      </div>
      <div className="flex min-h-0 flex-1 flex-col p-3">
        <h4 className="line-clamp-2 text-sm font-medium leading-snug text-foreground transition-colors group-hover:text-violet-300">
          {product.name}
        </h4>
        <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          {hasDiscount ? (
            <span className="text-xs text-[var(--color-text-muted)] line-through decoration-[var(--color-text-muted)] sm:text-sm">
              {formatPrice(product.original_price!)}
            </span>
          ) : null}
          <span className="text-sm font-bold text-[var(--color-positive)] sm:text-base">
            {formatPrice(product.price)}
          </span>
        </div>
        <div className="mt-1.5 flex min-h-[22px] items-center">
          {product.rating != null ? (
            <StarRating rating={Number(product.rating)} />
          ) : null}
        </div>
        <div className="mt-auto w-full pt-3">
          <span className="flex min-h-[44px] w-full items-center justify-center rounded-lg bg-[var(--color-brand-accent)] px-3 py-2.5 text-center text-xs font-bold text-[var(--color-text-inverse)] transition-colors hover:bg-amber-400">
            Ver oferta →
          </span>
        </div>
      </div>
    </AffiliateOutboundLink>
  );
}
