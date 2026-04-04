import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://dredecoplays.com.br";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dredeco Plays — Portal de Games",
    short_name: "Dredeco",
    description:
      "Reviews, guias, listas e notícias sobre games. Conteúdo para jogadores brasileiros.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0f",
    theme_color: "#7c3aed",
    lang: "pt-BR",
    orientation: "portrait-primary",
    icons: [
      {
        src: `${SITE_URL}/favicon.png`,
        sizes: "32x32",
        type: "image/png",
        purpose: "any",
      },
      {
        src: `${SITE_URL}/favicon.ico`,
        sizes: "48x48",
        type: "image/x-icon",
        purpose: "any",
      },
    ],
  };
}
