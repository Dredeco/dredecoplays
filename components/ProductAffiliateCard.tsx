"use client";

import { useId } from "react";
import type { Product } from "@/lib/types";
import AffiliateOutboundLink from "@/components/AffiliateOutboundLink";

function formatPrice(price: number): string {
  return `R$ ${Number(price).toFixed(2).replace(".", ",")}`;
}

function StarRating({ rating }: { rating: number }) {
  const baseId = useId().replace(/:/g, "");
  const r = Math.min(5, Math.max(0, Number(rating)));
  return (
    <div
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`Nota ${r.toFixed(1)} de 5`}
    >
      {Array.from({ length: 5 }, (_, i) => {
        const fill = Math.min(1, Math.max(0, r - i));
        const gid = `${baseId}-g-${i}`;
        return (
          <svg
            key={i}
            className="h-3.5 w-3.5 shrink-0"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <defs>
              <linearGradient id={gid} x1="0" x2="1" y1="0" y2="0">
                <stop
                  offset={`${fill * 100}%`}
                  stopColor="var(--color-brand-accent)"
                />
                <stop
                  offset={`${fill * 100}%`}
                  stopColor="var(--color-border)"
                />
              </linearGradient>
            </defs>
            <path
              fill={`url(#${gid})`}
              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            />
          </svg>
        );
      })}
      <span className="ml-1 text-xs text-[var(--color-text-muted)]">
        {r.toFixed(1)}
      </span>
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
  return (
    <AffiliateOutboundLink
      href={product.affiliate_url}
      productId={product.id}
      postId={postId}
      data-variant={variant}
      className="group flex h-full min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-surface shadow-[var(--shadow-card)] transition-[border-color,box-shadow] duration-[var(--transition-base)] hover:border-[var(--color-border-default)] hover:shadow-[var(--shadow-elevated)]"
    >
      <div className="flex h-28 w-full shrink-0 items-center justify-center bg-white/5 p-2">
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
        <h4 className="line-clamp-2 text-sm font-medium leading-snug text-foreground transition-colors group-hover:text-violet-300">
          {product.name}
        </h4>
        <div className="mt-1.5 flex flex-wrap items-baseline gap-1.5">
          <span className="text-sm font-bold text-emerald-500">
            {formatPrice(product.price)}
          </span>
          {product.original_price != null &&
            product.original_price > product.price && (
              <span className="text-xs text-muted line-through">
                {formatPrice(product.original_price)}
              </span>
            )}
        </div>
        {product.rating != null ? (
          <div className="mt-2">
            <StarRating rating={Number(product.rating)} />
          </div>
        ) : null}
        {/* mt-auto + pt-4: botão no rodapé em grid com altura igual + respiro mínimo acima do CTA */}
        <div className="mt-auto w-full pt-4">
          <span className="block w-full rounded-lg bg-amber-500 px-3 py-2.5 text-center text-xs font-bold text-black transition-colors hover:bg-amber-400">
            Ver oferta
          </span>
        </div>
      </div>
    </AffiliateOutboundLink>
  );
}
