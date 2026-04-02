export interface HowToStep {
  name: string;
  text: string;
}

interface Props {
  name: string;
  description?: string;
  steps: HowToStep[];
}

export default function HowToJsonLd({ name, description, steps }: Props) {
  if (!steps?.length) return null;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    ...(description ? { description } : {}),
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
