import NewsletterForm from "@features/newsletter/NewsletterForm";

export default function NewsletterBanner() {
  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-950/90 via-violet-900/80 to-surface p-6 sm:p-8 my-12 shadow-xl shadow-violet-950/40"
      aria-labelledby="newsletter-banner-heading"
    >
      <div className="absolute -right-8 -top-8 text-8xl opacity-10 select-none pointer-events-none" aria-hidden>
        🎮
      </div>

      <div className="relative z-10 max-w-2xl">
        <p className="text-violet-300 text-xs font-bold uppercase tracking-widest mb-2">
          Newsletter Dredeco Plays
        </p>
        <h2
          id="newsletter-banner-heading"
          className="text-2xl sm:text-3xl font-black text-white leading-tight mb-3"
        >
          Quer as melhores dicas e ofertas de games na sua caixa de entrada?
        </h2>
        <p className="text-violet-100/90 text-sm sm:text-base mb-6 leading-relaxed">
          Receba resumo semanal com notícias, reviews e promoções — direto pro
          jogador que não quer perder nada.
        </p>
        <NewsletterForm variant="inline" inlineTheme="gradient" />
      </div>
    </section>
  );
}
