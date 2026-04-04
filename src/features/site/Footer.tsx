import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import NewsletterForm from "@features/newsletter/NewsletterForm";
import logo from "@public/logo.png";

function FooterHeading({ children }: { children: ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-2.5">
      <span
        className="h-6 w-1 shrink-0 rounded-full bg-violet-600"
        aria-hidden
      />
      <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-foreground">
        {children}
      </h3>
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  const linkClass =
    "text-sm text-muted transition-colors hover:text-violet-600 dark:hover:text-violet-400";

  return (
    <footer className="relative mt-20 border-t border-border bg-bg text-foreground transition-colors">
      <div
        className="h-[2px] bg-gradient-to-r from-[var(--color-brand-primary)] via-[var(--color-brand-glow)] to-transparent opacity-95"
        aria-hidden
      />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10 sm:gap-x-8">
          <div className="space-y-4 lg:pr-4">
            <Link
              href="/"
              className="inline-block rounded-md ring-offset-2 ring-offset-bg transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-violet-600"
            >
              <Image
                src={logo}
                alt="Dredeco Plays"
                width={384}
                height={110}
                className="h-auto w-full max-w-[200px]"
                sizes="200px"
              />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-muted">
              Notícias, reviews e guias sobre games para jogadores brasileiros.
              PS5, Xbox, PC e Nintendo — com a personalidade da nossa
              comunidade.
            </p>
          </div>

          <div>
            <FooterHeading>Categorias</FooterHeading>
            <ul className="space-y-2.5">
              {[
                ["RPG / Soulslike", "/categoria/rpg-soulslike"],
                ["FPS / Ação", "/categoria/fps-acao"],
                ["Indie Games", "/categoria/indie-games"],
                ["Nintendo", "/categoria/nintendo"],
                ["PlayStation", "/categoria/playstation"],
                ["Xbox / PC", "/categoria/xbox-pc"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className={linkClass}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <FooterHeading>Links úteis</FooterHeading>
            <ul className="space-y-2.5">
              {[
                ["Sobre", "/sobre"],
                ["Contato", "/contato"],
                ["Blog", "/blog"],
                ["Política de Privacidade", "/politica-de-privacidade"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className={linkClass}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <div>
              <FooterHeading>Redes sociais</FooterHeading>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.youtube.com/channel/UCPd-LJ3Kvl7eCrJSviXJjIA"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white transition-[transform,box-shadow] duration-200 hover:scale-105 hover:shadow-[0_0_20px_rgba(124,58,237,0.45)]"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/dredecoplays/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-400 text-white transition-[transform,box-shadow] duration-200 hover:scale-105 hover:shadow-[0_0_20px_rgba(124,58,237,0.45)]"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
                <a
                  href="https://www.tiktok.com/@dredecoplays"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-[transform,box-shadow] duration-200 hover:scale-105 hover:bg-surface-2 hover:shadow-[0_0_18px_rgba(124,58,237,0.35)]"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.26-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <FooterHeading>Newsletter</FooterHeading>
              <p className="mb-3 text-xs leading-relaxed text-muted">
                Resumo semanal com notícias e ofertas. Sem spam.
              </p>
              <NewsletterForm variant="compact" />
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col gap-3 text-sm text-muted sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2">
            <p>© {year} Dredeco Plays. Todos os direitos reservados.</p>
            <p className="text-foreground sm:border-l sm:border-border sm:pl-6">
              Feito com ♥ para gamers brasileiros
            </p>
          </div>
          <p className="mt-6 max-w-4xl text-xs leading-relaxed text-muted">
            <span className="font-medium text-foreground">
              Aviso de afiliados:
            </span>{" "}
            Este site participa de programas de afiliados. Ao comprar pelos
            links, recebemos uma comissão sem custo adicional para você.
            Recomendamos apenas produtos que conhecemos e confiamos.
          </p>
        </div>
      </div>
    </footer>
  );
}
