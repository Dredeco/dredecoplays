"use client";

import AffiliateOutboundLink from "@/components/AffiliateOutboundLink";

export interface ComparisonRow {
  label: string;
  values: string[];
}

interface Props {
  title: string;
  columns: string[];
  rows: ComparisonRow[];
  affiliateUrls?: (string | undefined)[];
  productIds?: (number | undefined)[];
  postId?: number;
}

export default function ProductComparison({
  title,
  columns,
  rows,
  affiliateUrls = [],
  productIds = [],
  postId,
}: Props) {
  return (
    <div className="not-prose my-10 overflow-x-auto rounded-2xl border border-border bg-surface">
      <table className="w-full min-w-[480px] border-collapse text-left text-sm">
        <caption className="border-b border-border bg-surface-2 px-4 py-3 text-left text-base font-bold text-foreground">
          {title}
        </caption>
        <thead>
          <tr className="border-b border-border bg-violet-950/30">
            <th className="px-4 py-3 font-semibold text-muted">Critério</th>
            {columns.map((c, i) => (
              <th key={i} className="px-4 py-3 font-bold text-foreground">
                {affiliateUrls[i] ? (
                  <AffiliateOutboundLink
                    href={affiliateUrls[i]!}
                    productId={productIds[i]}
                    postId={postId}
                    className="text-violet-300 hover:text-violet-200"
                  >
                    {c}
                  </AffiliateOutboundLink>
                ) : (
                  c
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              className="border-b border-border last:border-0 odd:bg-surface-2/40"
            >
              <td className="px-4 py-3 font-medium text-muted">{row.label}</td>
              {row.values.map((v, vi) => (
                <td key={vi} className="px-4 py-3 text-foreground">
                  {v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
