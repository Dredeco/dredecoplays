import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dredecoplays.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: "/navicon.png",
    apple: "/navicon.png",
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
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Dredeco Plays",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="pt-BR" className="scroll-smooth">
      {/* Google AdSense */}
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7501367689908064"
          crossOrigin="anonymous"
        ></Script>

        <meta name="google-adsense-account" content="ca-pub-7501367689908064" />
      </head>

      <body
        className={`${geistSans.variable} antialiased bg-[#0a0a0f] text-gray-100 min-h-screen`}
      >
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />

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
      </body>
    </html>
  );
}
