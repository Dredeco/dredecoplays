import Link from "next/link";
import type { Category } from "@core/types";
import SectionHeader from "@features/site/SectionHeader";

interface Props {
  categories: Category[];
}

function CategoryIcon({ slug }: { slug: string }) {
  const common = "h-6 w-6 shrink-0";
  switch (slug) {
    case "fps-acao":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M6.92 5L5 9v11h2v-4h2v4h2V9l-1.08-4H6.92zM9 9H7V7h2v2zm10-4h-2.08L15 9v11h2v-4h2v4h2V9l-2-4zm-1 4h-2V7h2v2z" />
        </svg>
      );
    case "reviews":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      );
    case "indie-games":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M15.5 12c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm-7 0c0 .83-.67 1.5-1.5 1.5S5.5 12.83 5.5 12 6.17 10.5 7 10.5 8.5 11.17 8.5 12zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
        </svg>
      );
    case "rpg-soulslike":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    case "nintendo":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M14.5 8.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S12 7.67 12 6.75 12.67 5.25 13 5.25s1.5.67 1.5 1.5zM9.5 12c0 .83-.67 1.5-1.5 1.5S6.5 12.83 6.5 12 7.17 10.5 8 10.5s1.5.67 1.5 1.5zm5 3.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
        </svg>
      );
    case "playstation":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M9.5 4v11.11l-3 .89V6.89L9.5 4zm5 0v11.11l3 .89V6.89L14.5 4zM8 17.5l4 1.2 4-1.2V15l-4 1.2L8 15v2.5z" />
        </svg>
      );
    case "xbox-pc":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M6 7h12v10H6V7zm2 2v6h8V9H8zm-4 8h16v2H4v-2zm2-12h12v2H6V5z" />
        </svg>
      );
    case "noticias":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
        </svg>
      );
    case "listas-rankings":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.09-4-4L2 16.99z" />
        </svg>
      );
    case "guias-dicas":
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
        </svg>
      );
    default:
      return (
        <svg
          className={common}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3V9h3V6h2v3h3v1zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
        </svg>
      );
  }
}

/** Grid de categorias com borda lateral, ícone por slug e CTA por cor da API */
export default function CategoryShowcase({ categories }: Props) {
  if (!categories.length) return null;

  return (
    <section aria-labelledby="category-showcase-heading">
      <SectionHeader
        id="category-showcase-heading"
        label="Explore por categoria"
        href="/blog"
        linkText="Ver blog →"
      />
      <div className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 sm:mx-0 sm:grid sm:max-w-none sm:auto-rows-fr sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] sm:gap-3 sm:overflow-visible">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categoria/${cat.slug}`}
            className="group relative min-h-[44px] min-w-[200px] max-w-[min(100%,280px)] shrink-0 snap-start overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] shadow-[var(--shadow-card)] transition-[border-color,box-shadow,background-color,transform] duration-[var(--transition-base)] hover:border-[var(--color-border-default)] hover:bg-[var(--color-bg-elevated)] hover:shadow-[var(--shadow-elevated)] sm:min-h-0 sm:min-w-0 sm:max-w-none"
          >
            {/* Borda esquerda colorida com pseudo-elemento via inline style */}
            <div
              className="absolute inset-y-0 left-0 w-[4px] rounded-l-xl"
              style={{ backgroundColor: cat.color }}
              aria-hidden
            />
            <div className="p-4 pl-4">
              <div className="flex items-start gap-3">
                <span
                  className="block h-6 w-6 mt-1 shrink-0 transition-colors group-hover:opacity-90"
                  style={{ color: cat.color }}
                >
                  <CategoryIcon slug={cat.slug} />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-foreground transition-colors group-hover:text-violet-400">
                    {cat.name}
                  </h3>
                  {cat.description ? (
                    <p className="mt-1 line-clamp-2 text-sm text-[var(--color-text-secondary)]">
                      {cat.description}
                    </p>
                  ) : null}
                  <span
                    className="mt-3 inline-flex items-center gap-1 text-sm font-semibold transition-opacity group-hover:opacity-90"
                    style={{ color: cat.color }}
                  >
                    Ver artigos
                    <span aria-hidden>→</span>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
