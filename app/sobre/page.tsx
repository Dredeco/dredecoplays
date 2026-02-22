import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "Conheça o Dredeco Plays — um portal de games criado por apaixonados por videogames.",
};

export default function SobrePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-violet-700 rounded flex items-center justify-center">
            <span className="text-white font-black text-lg">D</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Sobre o Dredeco Plays
          </h1>
        </div>
        <div className="w-20 h-1 bg-violet-600 rounded-full" />
      </div>

      <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
        <p>
          O <strong className="text-white">Dredeco Plays</strong> é um portal
          de games em português brasileiro, criado para quem ama videogames e
          quer conteúdo de qualidade — sem enrolação.
        </p>

        <p>
          Aqui você encontra reviews honestas, guias completos, listas temáticas
          e notícias do mundo dos games. Nosso foco é em RPGs, Soulslikes,
          Indie Games e tudo que vale a pena jogar — de PlayStation a PC.
        </p>

        <h2 className="text-2xl font-bold text-white pt-4">O que você encontra aqui</h2>

        <ul className="space-y-3">
          {[
            ["🎮 Reviews completas", "Análises honestas com notas e veredicto final."],
            ["📋 Listas temáticas", "Como \"5 jogos para quem amou Elden Ring\"."],
            ["📖 Guias e dicas", "Do básico ao avançado para dominar seus games favoritos."],
            ["📰 Notícias", "O que está rolando no mundo dos games."],
          ].map(([title, desc]) => (
            <li key={title} className="flex gap-3">
              <div className="flex-1">
                <strong className="text-white block">{title}</strong>
                <span className="text-gray-400 text-base">{desc}</span>
              </div>
            </li>
          ))}
        </ul>

        <div className="bg-[#13131a] border border-[#2a2a3a] rounded-xl p-6 mt-8">
          <h3 className="text-white font-bold text-lg mb-2">Aviso de Afiliados</h3>
          <p className="text-gray-400 text-base">
            Este site participa dos programas de afiliados da Amazon e Mercado
            Livre. Ao comprar produtos através dos nossos links, recebemos uma
            comissão sem nenhum custo adicional para você. Isso nos ajuda a
            manter o site funcionando e produzindo conteúdo de qualidade.
            Recomendamos apenas produtos que conhecemos e confiamos.
          </p>
        </div>
      </div>

      <div className="mt-10 flex gap-4">
        <Link
          href="/blog"
          className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Ver todos os artigos
        </Link>
        <Link
          href="/contato"
          className="bg-[#1c1c28] hover:bg-[#2a2a3a] text-gray-300 font-semibold px-6 py-3 rounded-lg border border-[#2a2a3a] transition-colors"
        >
          Contato
        </Link>
      </div>
    </div>
  );
}
