import Link from "next/link";
import type { Category } from "@/lib/types";

interface Props {
  categories: Category[];
}

/** Grid de categorias com barra colorida e CTA por cor da API */
export default function CategoryShowcase({ categories }: Props) {
  if (!categories.length) return null;

  return (
    <section aria-labelledby="category-showcase-heading">
      <div className="mb-5 flex items-center gap-3">
        <div className="h-7 w-1 shrink-0 rounded-full bg-violet-600" />
        <h2
          id="category-showcase-heading"
          className="text-xl font-bold text-foreground"
        >
          Explore por categoria
        </h2>
        <Link
          href="/blog"
          className="ml-auto text-sm text-violet-400 transition-colors hover:text-violet-300"
        >
          Ver blog →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categoria/${cat.slug}`}
            className="group overflow-hidden rounded-xl border border-border bg-surface shadow-md transition-all hover:border-opacity-60 hover:shadow-lg"
          >
            <div
              className="h-1.5 w-full"
              style={{ backgroundColor: cat.color }}
            />
            <div className="p-4">
              <h3 className="font-bold text-foreground transition-colors group-hover:text-violet-400">
                {cat.name}
              </h3>
              {cat.description ? (
                <p className="mt-1 line-clamp-2 text-sm text-muted">
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
          </Link>
        ))}
      </div>
    </section>
  );
}
