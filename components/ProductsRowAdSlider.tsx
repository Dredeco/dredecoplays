import type { Product } from "@/lib/types";
import ProductAffiliateCard from "@/components/ProductAffiliateCard";

interface Props {
  products: Product[];
  postId?: number;
}

export default function ProductsRowAdSlider({ products, postId }: Props) {
  const list = products.length > 0 ? products : [];

  return (
    <div className="relative">
      <div
        className={
          "flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] " +
          "snap-x snap-mandatory " +
          "[&::-webkit-scrollbar]:hidden " +
          "lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:pb-0 xl:grid-cols-4"
        }
        role="list"
        aria-label="Produtos recomendados"
      >
        {list.map((product) => (
          <div
            key={product.id}
            className="flex w-[min(72vw,260px)] shrink-0 snap-start lg:h-full lg:min-h-0 lg:w-auto lg:min-w-0 lg:flex-col"
            role="listitem"
          >
            <ProductAffiliateCard product={product} postId={postId} variant="row" />
          </div>
        ))}
      </div>
    </div>
  );
}
