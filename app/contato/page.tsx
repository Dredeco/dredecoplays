import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contato",
  description: "Entre em contato com o Dredeco Plays.",
};

export default function ContatoPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2">
        Contato
      </h1>
      <div className="w-16 h-1 bg-violet-600 rounded-full mb-8" />

      <p className="text-foreground text-lg mb-8 leading-relaxed">
        Tem sugestões de pauta, quer enviar um review, fazer uma parceria ou
        apenas bater um papo sobre games? Manda mensagem!
      </p>

      <form className="space-y-5" action="#" method="POST">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            Nome
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-violet-600 transition-colors text-sm"
            placeholder="Seu nome"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            E-mail
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-violet-600 transition-colors text-sm"
            placeholder="seu@email.com"
          />
        </div>

        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            Assunto
          </label>
          <select
            id="subject"
            name="subject"
            className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-violet-600 transition-colors text-sm"
          >
            <option value="parceria">Parceria / Publicidade</option>
            <option value="sugestao">Sugestão de pauta</option>
            <option value="erro">Reportar erro</option>
            <option value="outro">Outro</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            Mensagem
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-violet-600 transition-colors text-sm resize-none"
            placeholder="Sua mensagem..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Enviar mensagem
        </button>
      </form>

      <p className="mt-6 text-sm text-muted text-center">
        Ou envie um e-mail diretamente para{" "}
        <a
          href="mailto:contato@dredecoplays.com"
          className="text-violet-400 hover:underline"
        >
          contato@dredecoplays.com
        </a>
      </p>
    </div>
  );
}
