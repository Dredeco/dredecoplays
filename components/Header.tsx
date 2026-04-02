"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/public/logo.png";
import ThemeToggle from "@/components/ThemeToggle";

const navigation = [
  { label: "Ofertas", href: "/ofertas" },
  { label: "Listas & Rankings", href: "/categoria/listas-rankings" },
  { label: "Reviews", href: "/categoria/reviews" },
  { label: "Notícias", href: "/categoria/noticias" },
  { label: "Guias & Dicas", href: "/categoria/guias-dicas" },
  { label: "Indie Games", href: "/categoria/indie-games" },
  { label: "RPG / Soulslike", href: "/categoria/rpg-soulslike" },
  { label: "PlayStation", href: "/categoria/playstation" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    setSearchOpen(false);
    setSearchQuery("");
    router.push(`/busca?q=${encodeURIComponent(q)}`);
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-bg/95 backdrop-blur-md border-b border-border transition-shadow duration-200 ${
          isScrolled ? "shadow-md" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <Image src={logo} alt="Dredeco Plays" width={115} priority />
            </Link>

            <nav className="hidden xl:flex items-center gap-1">
              {navigation.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm px-3 py-2 rounded-md font-medium transition-colors ${
                      isActive
                        ? "text-white bg-violet-950/50"
                        : "text-nav hover:text-violet-400 hover:bg-surface-2"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <Link
                href="/blog"
                className="hidden sm:flex items-center gap-1.5 text-sm text-nav-muted hover:text-nav transition-colors px-3 py-2"
              >
                Blog
              </Link>
              <Link
                href="/sobre"
                className="hidden sm:flex items-center gap-1.5 text-sm text-nav-muted hover:text-nav transition-colors px-3 py-2"
              >
                Sobre
              </Link>
              <ThemeToggle />
              <button
                className="text-nav-muted hover:text-nav transition-colors p-2 rounded-md hover:bg-surface-2"
                aria-label="Buscar"
                onClick={() => setSearchOpen(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
              <button
                className="xl:hidden text-nav-muted hover:text-nav transition-colors p-2"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      menuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              </button>
            </div>
          </div>

          {menuOpen && (
            <nav className="xl:hidden pb-4 border-t border-border pt-3 flex flex-col gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-nav hover:text-violet-400 transition-colors font-medium py-2 px-2 rounded-md hover:bg-surface-2"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-border mt-2 pt-2 flex gap-4">
                <Link
                  href="/blog"
                  className="text-sm text-nav-muted py-2 px-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Blog
                </Link>
                <Link
                  href="/sobre"
                  className="text-sm text-nav-muted py-2 px-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Sobre
                </Link>
                <Link
                  href="/contato"
                  className="text-sm text-nav-muted py-2 px-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Contato
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Search overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSearchOpen(false);
          }}
        >
          <div className="w-full max-w-2xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden">
            <form onSubmit={handleSearchSubmit} className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute left-5 top-1/2 -translate-y-1/2 text-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar games, reviews, guias..."
                className="w-full bg-transparent px-5 py-5 pl-14 pr-24 text-foreground placeholder:text-muted focus:outline-none text-base"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <kbd className="hidden sm:inline-block text-xs text-muted bg-surface-2 border border-border rounded px-1.5 py-0.5">
                  ESC
                </kbd>
                <button
                  type="submit"
                  className="bg-violet-700 hover:bg-violet-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  Buscar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
