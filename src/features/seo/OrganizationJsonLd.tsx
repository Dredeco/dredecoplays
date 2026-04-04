const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://dredecoplays.com.br";

/** Perfis sociais públicos (preencher quando existirem) */
const SAME_AS: string[] = [];

export default function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Dredeco Plays",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description:
      "Portal de games com notícias, reviews, guias e listas.",
    ...(SAME_AS.length > 0 ? { sameAs: SAME_AS } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
