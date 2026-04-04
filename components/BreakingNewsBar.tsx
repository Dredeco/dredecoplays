import Link from "next/link";
import type { Post } from "@/lib/types";

interface Props {
  posts: Post[];
}

function NewsList({ posts }: { posts: Post[] }) {
  return (
    <ul
      className="flex items-center gap-x-6 whitespace-nowrap py-0.5 pr-6"
      aria-hidden
    >
      {posts.map((post, i) => {
        const color = post.category?.color ?? "#7c3aed";
        return (
          <li key={post.id} className="inline-flex items-center gap-2">
            {i > 0 && (
              <span className="text-muted select-none" aria-hidden>
                ·
              </span>
            )}
            <span
              className="h-2 w-2 shrink-0 rounded-full ring-2 ring-white/10 [html.light_&]:ring-black/10"
              style={{ backgroundColor: color }}
              aria-hidden
            />
            <Link
              href={`/blog/${post.slug}`}
              className="font-medium text-foreground transition-colors hover:text-violet-400"
              tabIndex={-1}
            >
              {post.title}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** Barra slim com últimas manchetes rolando horizontalmente */
export default function BreakingNewsBar({ posts }: Props) {
  if (!posts.length) return null;

  return (
    <div
      className="border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)]/90 backdrop-blur-md"
      role="region"
      aria-label="Últimas publicações"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 sm:px-6 sm:gap-4">
        {/* Badge "AGORA" — vermelho pulsante */}
        <div className="flex shrink-0 items-center gap-2 rounded-lg bg-[var(--color-negative)] px-3 py-2 text-[11px] font-black uppercase tracking-[var(--tracking-wider)] text-white shadow-[0_0_12px_rgba(239,68,68,0.45)] sm:px-3.5 sm:py-2 sm:text-xs">
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full bg-white/90 [animation:pulse-agora_2s_ease-in-out_infinite] sm:h-3 sm:w-3"
            aria-hidden
          />
          Agora
        </div>

        <div className="group min-w-0 flex-1 overflow-hidden">
          <div className="breaking-ticker-track flex w-max [animation:ticker-scroll_50s_linear_infinite] group-hover:[animation-play-state:paused]">
            <NewsList posts={posts} />
            <NewsList posts={posts} />
          </div>
        </div>
      </div>

      <ul className="sr-only">
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
