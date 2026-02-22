"use client";

import { useEffect, useState } from "react";
import { Heading } from "@/lib/posts";

interface Props {
  headings: Heading[];
}

export default function TableOfContents({ headings }: Props) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0% -60% 0%" }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="Índice do artigo" className="sticky top-24">
      <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
        <span className="w-4 h-px bg-violet-600 inline-block" />
        Neste artigo
      </h3>
      <ul className="space-y-1">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={`block text-sm py-1 transition-colors leading-snug ${
                heading.level === 3 ? "pl-4" : "pl-0"
              } ${
                activeId === heading.id
                  ? "text-violet-400 font-medium"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
