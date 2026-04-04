import Link from "next/link";
import { getPublicProducts } from "@core/api-client";
import ProductAffiliateCard from "@features/products/ProductAffiliateCard";
import { shuffle } from "@core/utils";

/**
 * Bloco opcional para destacar ofertas junto à newsletter (funil receita + lista).
 * Em produção, pode espelhar o mesmo conteúdo no template Brevo (HTML do e-mail).
 */
export default async function NewsletterMonetizedUpsell() {
  const products = await getPublicProducts({ sort: "discount" });
  const picks = shuffle(products).slice(0, 2);
  if (picks.length === 0) return null;

  return (
    <section className="rounded-2xl border border-border bg-surface-2/50 p-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            Ofertas da semana
          </p>
          <h3 className="text-base font-bold text-foreground">
            Antes de sair, confira estes picks
          </h3>
        </div>
        <Link
          href="/ofertas"
          className="text-xs font-semibold text-violet-400 hover:text-violet-300"
        >
          Ver todas →
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {picks.map((p) => (
          <ProductAffiliateCard key={p.id} product={p} variant="grid" />
        ))}
      </div>
    </section>
  );
}
