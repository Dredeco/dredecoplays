import { getPublicProducts } from "@/lib/api";
import { shuffle } from "@/lib/utils";
import ProductAffiliateCard from "@/components/ProductAffiliateCard";

interface Props {
  className?: string;
  /** Quando exibido dentro de um post, rastreia cliques com contexto */
  postId?: number;
}

export default async function ProductsGridAd({ className = "", postId }: Props) {
  const products = await getPublicProducts();
  const display = shuffle(products).slice(0, 6);

  if (display.length === 0) return null;

  return (
    <div
      className={`bg-surface rounded-xl border border-border shadow-md p-5 ${className}`}
    >
      <h3 className="text-foreground font-bold text-xs uppercase tracking-widest mb-4">
        Produtos Recomendados
      </h3>
      <div className="grid grid-cols-2 gap-3 items-stretch">
        {display.map((product) => (
          <ProductAffiliateCard
            key={product.id}
            product={product}
            postId={postId}
            variant="grid"
          />
        ))}
      </div>
    </div>
  );
}
