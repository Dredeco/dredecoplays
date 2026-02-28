import { getPublicProducts } from "@/lib/api";
import { shuffle } from "@/lib/utils";
import ProductsRowAdSlider from "@/components/ProductsRowAdSlider";

interface Props {
  className?: string;
}

export default async function ProductsRowAd({ className = "" }: Props) {
  const products = await getPublicProducts();
  const display = shuffle(products).slice(0, 8);

  if (display.length === 0) return null;

  return (
    <section className={className}>
      <h3 className="text-foreground font-bold text-sm uppercase tracking-widest mb-4">
        Produtos Recomendados
      </h3>
      <ProductsRowAdSlider products={display} />
    </section>
  );
}
