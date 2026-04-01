const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://dredecoplays.com.br";

/**
 * Schema WebSite com SearchAction — habilita a caixinha de busca do Google
 * diretamente nos resultados de busca (Sitelinks Search Box).
 * Referência: https://developers.google.com/search/docs/appearance/structured-data/sitelinks-searchbox
 */
export default function WebsiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "Dredeco Plays",
    alternateName: "Dredeco Plays — Portal de Games",
    url: SITE_URL,
    description:
      "Reviews, guias, listas e notícias sobre games. Conteúdo apaixonado para quem ama videogames.",
    inLanguage: "pt-BR",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/busca?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
