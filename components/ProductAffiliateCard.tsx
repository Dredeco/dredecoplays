"use client";

import type { Product } from "@/lib/types";
import AffiliateOutboundLink from "@/components/AffiliateOutboundLink";

function formatPrice(price: number): string {
  return `R$ ${Number(price).toFixed(2).replace(".", ",")}`;
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
  const isRow = variant === "row";
  return (
    <AffiliateOutboundLink
      href={product.affiliate_url}
      productId={product.id}
      postId={postId}
      className={
        isRow
          ? "group flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-md transition-colors hover:border-violet-600/50"
          : "flex h-full min-w-0 flex-col overflow-hidden rounded-xl bg-surface border border-border shadow-md hover:border-violet-600/50 transition-colors group"
      }
    >
      <div
        className={
          isRow
            ? "flex h-24 w-full shrink-0 items-center justify-center bg-surface-2 p-2"
            : "h-20 w-full shrink-0 bg-surface-2 flex items-center justify-center p-2"
        }
      >
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
      <div className={`flex min-h-0 flex-1 flex-col ${isRow ? "p-3" : "p-3"}`}>
        <h4
          className={
            isRow
              ? "line-clamp-2 text-xs font-medium text-foreground transition-colors group-hover:text-violet-300 sm:text-sm"
              : "text-sm font-medium text-foreground line-clamp-2 group-hover:text-violet-300 transition-colors"
          }
        >
          {product.name}
        </h4>
        <div className="mt-1 flex flex-wrap items-baseline gap-1.5">
          <span
            className={
              isRow ? "text-sm font-bold text-cyan-400" : "text-cyan-400 font-bold text-sm"
            }
          >
            {formatPrice(product.price)}
          </span>
          {product.original_price != null &&
            product.original_price > product.price && (
              <span
                className={
                  isRow
                    ? "text-xs text-muted line-through"
                    : "text-muted line-through text-xs"
                }
              >
                {formatPrice(product.original_price)}
              </span>
            )}
        </div>
        {product.rating != null && (
          <span
            className={
              isRow
                ? "mt-0.5 text-xs text-yellow-400"
                : "text-yellow-400 mt-0.5 inline-block text-xs"
            }
          >
            ★ {Number(product.rating).toFixed(1)}
          </span>
        )}
        <span
          className={
            isRow
              ? "mt-2 rounded-lg bg-violet-600 px-2.5 py-1.5 text-center text-[11px] font-medium text-white transition-colors hover:bg-violet-500 sm:text-xs"
              : "mt-2 px-3 py-1.5 text-center rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium transition-colors"
          }
        >
          Ver oferta
        </span>
      </div>
    </AffiliateOutboundLink>
  );
}
