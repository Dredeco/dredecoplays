import type { Product } from "@/lib/types";
import ProductAffiliateCard from "@/components/ProductAffiliateCard";

interface Props {
  products: Product[];
  postId: number;
}

export default function PostLinkedProducts({ products, postId }: Props) {
  if (!products?.length) return null;

  return (
    <section className="not-prose my-10 rounded-2xl border border-border bg-surface p-6">
      <h2 className="text-lg font-extrabold text-foreground">
        Produtos mencionados neste artigo
      </h2>
      <p className="mt-1 text-sm text-muted">
        Links de afiliado — você apoia o Dredeco sem pagar a mais.
      </p>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {products.map((product) => (
          <ProductAffiliateCard
            key={product.id}
            product={product}
            postId={postId}
            variant="grid"
          />
        ))}
      </div>
    </section>
  );
}
