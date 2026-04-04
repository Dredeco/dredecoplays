"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@public/logo.png";
import ThemeToggle from "@features/site/ThemeToggle";

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
  const [isCompact, setIsCompact] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 0);
      setIsCompact(y > 80);
    };
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
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMenuOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

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
        role="banner"
        className={`sticky top-0 z-[100] border-b border-[var(--color-border-subtle)] bg-[color-mix(in_srgb,var(--color-bg-base)_92%,transparent)] backdrop-blur-[20px] transition-shadow duration-200 ${
          isScrolled ? "shadow-md" : ""
        }`}
      >
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-[var(--color-brand-primary)] via-[var(--color-brand-glow)] to-transparent opacity-90"
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div
            className={`flex items-center justify-between transition-[height] duration-300 ease-out ${
              isCompact ? "h-12" : "h-16"
            }`}
          >
            <Link
              href="/"
              className={`flex shrink-0 items-center gap-2 transition-transform duration-300 ease-out ${
                isCompact ? "scale-[0.85]" : "scale-100"
              }`}
            >
              <Image src={logo} alt="Dredeco Plays" width={115} priority />
            </Link>

            <nav
              aria-label="Principal"
              className="hidden xl:flex items-center gap-1 flex-1 min-w-0 justify-center px-2"
            >
              {navigation.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const isOfertas = item.href === "/ofertas";
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm px-3 py-2 rounded-full font-medium transition-colors ${
                      isOfertas
                        ? isActive
                          ? "bg-amber-500/25 text-amber-400 ring-1 ring-amber-500/40 [html.light_&]:bg-amber-200 [html.light_&]:text-amber-900 [html.light_&]:ring-amber-500/50"
                          : "bg-amber-500/10 text-amber-400/95 hover:bg-amber-500/20 [html.light_&]:bg-amber-100/90 [html.light_&]:text-amber-900 [html.light_&]:hover:bg-amber-200/90"
                        : isActive
                          ? "bg-violet-950/50 text-white [html.light_&]:bg-violet-200 [html.light_&]:text-violet-900 [html.light_&]:ring-1 [html.light_&]:ring-violet-400/60"
                          : "text-nav hover:bg-violet-500/15 hover:text-violet-300 [html.light_&]:hover:bg-violet-100 [html.light_&]:hover:text-violet-800"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <span
                className="hidden xl:inline-block w-px h-5 bg-[var(--color-border-subtle)] mx-1"
                aria-hidden
              />
              <Link
                href="/blog"
                className="hidden sm:flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-nav-muted transition-colors hover:bg-violet-500/15 hover:text-nav [html.light_&]:hover:bg-violet-100 [html.light_&]:hover:text-violet-900"
              >
                Blog
              </Link>
              <Link
                href="/sobre"
                className="hidden sm:flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-nav-muted transition-colors hover:bg-violet-500/15 hover:text-nav [html.light_&]:hover:bg-violet-100 [html.light_&]:hover:text-violet-900"
              >
                Sobre
              </Link>
              <ThemeToggle />
              <button
                type="button"
                className="rounded-md p-2 text-nav-muted transition-colors hover:bg-surface-2 hover:text-nav [html.light_&]:hover:bg-slate-200"
                aria-label="Abrir busca"
                aria-expanded={searchOpen}
                onClick={() => setSearchOpen((o) => !o)}
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
                type="button"
                className="rounded-md p-2 text-nav-muted transition-colors hover:bg-surface-2 hover:text-nav xl:hidden [html.light_&]:hover:bg-slate-200"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
                aria-expanded={menuOpen}
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

          {searchOpen ? (
            <div className="absolute left-0 right-0 top-full z-[110] border-b border-[var(--color-border-subtle)] bg-[color-mix(in_srgb,var(--color-bg-base)_96%,transparent)] px-4 pb-4 pt-2 backdrop-blur-[20px]">
              <form
                onSubmit={handleSearchSubmit}
                className="relative flex w-full items-center gap-2 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] px-4 py-3 shadow-[var(--shadow-elevated)]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 shrink-0 text-muted"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden
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
                  className="min-h-[44px] flex-1 bg-transparent text-foreground placeholder:text-muted focus:outline-none text-base"
                />
                <kbd className="hidden sm:inline-block text-xs text-muted bg-surface-2 border border-border rounded px-1.5 py-0.5">
                  ESC
                </kbd>
                <button
                  type="button"
                  className="rounded-lg p-2 text-muted hover:text-foreground"
                  aria-label="Fechar busca"
                  onClick={() => setSearchOpen(false)}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </form>
            </div>
          ) : null}
        </div>
      </header>

      {menuOpen ? (
        <div
          className="fixed inset-0 z-[90] xl:hidden bg-[var(--color-bg-base)]/95 backdrop-blur-md pt-[4.5rem] px-4 pb-8 overflow-y-auto"
          id="mobile-menu"
        >
          <nav aria-label="Mobile" className="flex flex-col gap-1 max-w-[min(100%,28rem)] mx-auto">
            {navigation.map((item, i) => {
              const isOfertas = item.href === "/ofertas";
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{ animationDelay: `${i * 45}ms` }}
                  className={`mobile-nav-item flex min-h-[44px] items-center rounded-xl px-4 py-3.5 text-base font-medium ${
                    isOfertas
                      ? "border border-amber-500/25 bg-amber-500/15 text-amber-400 [html.light_&]:border-amber-300 [html.light_&]:bg-amber-100 [html.light_&]:text-amber-900"
                      : "text-nav hover:bg-violet-500/15 [html.light_&]:hover:bg-violet-100"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="border-t border-border mt-4 pt-4 flex flex-col gap-1">
              <Link
                href="/blog"
                className="rounded-xl px-4 py-3.5 text-base text-nav-muted min-h-[44px] flex items-center hover:bg-violet-500/10"
                onClick={() => setMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/sobre"
                className="rounded-xl px-4 py-3.5 text-base text-nav-muted min-h-[44px] flex items-center hover:bg-violet-500/10"
                onClick={() => setMenuOpen(false)}
              >
                Sobre
              </Link>
              <Link
                href="/contato"
                className="rounded-xl px-4 py-3.5 text-base text-nav-muted min-h-[44px] flex items-center hover:bg-violet-500/10"
                onClick={() => setMenuOpen(false)}
              >
                Contato
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}
