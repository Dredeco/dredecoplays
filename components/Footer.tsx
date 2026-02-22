import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a0f] border-t border-[#2a2a3a] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Categorias */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
              Categorias
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              {[
                ["RPG / Soulslike", "/categoria/rpg-soulslike"],
                ["FPS / Ação", "/categoria/fps-acao"],
                ["Indie Games", "/categoria/indie-games"],
                ["Nintendo", "/categoria/nintendo"],
                ["PlayStation", "/categoria/playstation"],
                ["Xbox / PC", "/categoria/xbox-pc"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="hover:text-violet-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Redes Sociais */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
              Redes Sociais
            </h3>
            <div className="flex gap-3 flex-wrap">
              <a
                href="#"
                aria-label="Facebook"
                className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white text-sm font-bold hover:bg-blue-600 transition-colors"
              >
                f
              </a>
              <a
                href="#"
                aria-label="Twitter/X"
                className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center text-white text-sm font-bold hover:bg-zinc-700 transition-colors"
              >
                𝕏
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white text-sm hover:bg-red-500 transition-colors"
              >
                ▶
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white text-sm hover:bg-pink-500 transition-colors"
              >
                ◉
              </a>
            </div>
          </div>

          {/* Links Úteis */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
              Links Úteis
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              {[
                ["Sobre", "/sobre"],
                ["Contato", "/contato"],
                ["Blog", "/blog"],
                ["Política de Privacidade", "/politica-de-privacidade"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="hover:text-violet-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Aviso de Afiliados */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
              Aviso de Afiliados
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Este site participa de programas de afiliados. Ao comprar pelos
              links, recebo uma comissão sem custo adicional para você.
              Recomendo apenas produtos que conheço e confio.
            </p>
          </div>
        </div>

        <div className="border-t border-[#2a2a3a] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <p>© {year} Dredeco Plays. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <Link href="/politica-de-privacidade" className="hover:text-gray-300 transition-colors">
              Política de Privacidade
            </Link>
            <Link href="/contato" className="hover:text-gray-300 transition-colors">
              Contato
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
