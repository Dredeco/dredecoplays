import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  items: BreadcrumbItem[];
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://dredecoplays.com.br";

export default function Breadcrumbs({ items }: Props) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href ? `${SITE_URL}${item.href}` : undefined,
    })),
  };

  const last = items.length - 1;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb">
        <ol className="breadcrumb-nav flex flex-wrap items-center gap-x-2 gap-y-1">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              {index > 0 ? (
                <span className="breadcrumb-sep" aria-hidden>
                  ›
                </span>
              ) : null}
              {item.href ? (
                <Link
                  href={item.href}
                  className="text-[var(--color-text-muted)] hover:text-[var(--color-brand-primary)]"
                  {...(index === last ? { "aria-current": "page" as const } : {})}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={
                    index === last
                      ? "font-medium text-[var(--color-text-primary)]"
                      : "text-[var(--color-text-muted)]"
                  }
                  aria-current={index === last ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
