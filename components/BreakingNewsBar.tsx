import Link from "next/link";
import type { Post } from "@/lib/types";

interface Props {
  posts: Post[];
}

function NewsList({ posts }: { posts: Post[] }) {
  return (
    <ul
      className="flex items-center gap-x-6 whitespace-nowrap py-0.5 text-sm pr-6"
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
              className="h-2 w-2 shrink-0 rounded-full ring-2 ring-white/10"
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
      className="border-b border-border bg-surface/80 backdrop-blur-md"
      role="region"
      aria-label="Últimas publicações"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 sm:px-6 sm:gap-4">
        {/* Badge "Agora" */}
        <div className="flex shrink-0 items-center gap-2 rounded-md bg-violet-600 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-white sm:text-xs">
          <span
            className="h-2 w-2 shrink-0 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.9)] animate-pulse"
            aria-hidden
          />
          Agora
        </div>

        {/* Ticker com rolagem contínua */}
        <div className="group min-w-0 flex-1 overflow-hidden">
          {/* Dois conjuntos idênticos garantem loop sem salto */}
          <div className="flex w-max [animation:marquee_50s_linear_infinite] group-hover:[animation-play-state:paused]">
            <NewsList posts={posts} />
            <NewsList posts={posts} />
          </div>
        </div>
      </div>

      {/* Lista acessível oculta visualmente para leitores de tela */}
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
