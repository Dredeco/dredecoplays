import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import ScrollToTop from "@/components/ScrollToTop";
import NewsletterPopup from "@/components/NewsletterPopup";
import OrganizationJsonLd from "@/components/seo/OrganizationJsonLd";
import WebsiteJsonLd from "@/components/seo/WebsiteJsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://dredecoplays.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [
      { url: `${SITE_URL}/favicon.ico`, sizes: "any" },
      { url: `${SITE_URL}/favicon.png`, type: "image/png", sizes: "32x32" },
    ],
    apple: `${SITE_URL}/favicon.png`,
  },
  title: {
    default: "Dredeco Plays — Portal de Games",
    template: "%s | Dredeco Plays",
  },
  description:
    "Reviews, guias, listas e notícias sobre games. Conteúdo apaixonado para quem ama videogames.",
  keywords: [
    "games",
    "reviews",
    "RPG",
    "soulslike",
    "indie games",
    "PlayStation",
    "guias de jogos",
    "Elden Ring",
  ],
  authors: [{ name: "Dredeco Plays" }],
  creator: "Dredeco Plays",
  publisher: "Dredeco Plays",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: "Dredeco Plays",
    images: [
      {
        url: `${SITE_URL}/og-default.png`,
        width: 1200,
        height: 630,
        alt: "Dredeco Plays",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@dredecoplays",
    creator: "@dredecoplays",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "application-name": "Dredeco Plays",
  },
};

const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-7501367689908064";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="pt-BR" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.dredecoplays.com.br" crossOrigin="anonymous" />
        <meta name="google-adsense-account" content={ADSENSE_CLIENT} />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Dredeco Plays — Feed RSS"
          href={`${SITE_URL}/feed.xml`}
        />
        <OrganizationJsonLd />
        <WebsiteJsonLd />
      </head>

      <body
        className={`${geistSans.variable} antialiased bg-bg text-foreground min-h-screen transition-colors duration-300`}
      >
        <Script
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(ADSENSE_CLIENT)}`}
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
        <Providers>
          <NewsletterPopup />
          <Suspense fallback={null}>
            <ScrollToTop />
          </Suspense>
          <Header />
          <main className="min-h-screen" suppressHydrationWarning>
            {children}
          </main>
          <Footer />
        </Providers>

        {/* Google Analytics 4 — adicionar NEXT_PUBLIC_GA_ID no .env.local */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
              navigator.serviceWorker.register('/sw.js').catch(function () {});
            }
          `}
        </Script>
      </body>
    </html>
  );
}
