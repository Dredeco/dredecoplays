"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const navigation = [
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
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-md border-b border-[#2a2a3a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-violet-700 rounded flex items-center justify-center shadow-lg shadow-violet-900/50">
              <span className="text-white font-black text-base leading-none">D</span>
            </div>
            <span className="font-black text-base sm:text-lg tracking-wider">
              <span className="text-white">DREDECO</span>
              <span className="text-violet-400"> PLAYS</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm px-3 py-2 rounded-md font-medium transition-colors ${
                    isActive
                      ? "text-violet-400 bg-violet-950/50"
                      : "text-gray-300 hover:text-violet-400 hover:bg-[#1c1c28]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Link
              href="/blog"
              className="hidden sm:flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors px-3 py-2"
            >
              Blog
            </Link>
            <Link
              href="/sobre"
              className="hidden sm:flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors px-3 py-2"
            >
              Sobre
            </Link>
            <button
              className="text-gray-400 hover:text-white transition-colors p-2"
              aria-label="Buscar"
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
              className="xl:hidden text-gray-400 hover:text-white transition-colors p-2"
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
                  d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <nav className="xl:hidden pb-4 border-t border-[#2a2a3a] pt-3 flex flex-col gap-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-gray-300 hover:text-violet-400 transition-colors font-medium py-2 px-2 rounded-md hover:bg-[#1c1c28]"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-[#2a2a3a] mt-2 pt-2 flex gap-4">
              <Link href="/blog" className="text-sm text-gray-400 py-2 px-2" onClick={() => setMenuOpen(false)}>Blog</Link>
              <Link href="/sobre" className="text-sm text-gray-400 py-2 px-2" onClick={() => setMenuOpen(false)}>Sobre</Link>
              <Link href="/contato" className="text-sm text-gray-400 py-2 px-2" onClick={() => setMenuOpen(false)}>Contato</Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
