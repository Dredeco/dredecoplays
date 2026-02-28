"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";

function formatPrice(price: number): string {
  return `R$ ${Number(price).toFixed(2).replace(".", ",")}`;
}

function ProductCard({ product }: { product: Product }) {
  return (
    <a
      href={product.affiliate_url}
      target="_blank"
      rel="nofollow sponsored noopener noreferrer"
      className="flex flex-col h-full rounded-xl bg-[#13131a] border border-[#2a2a3a] overflow-hidden hover:border-violet-600/50 transition-colors group"
    >
      <div className="h-36 w-full shrink-0 overflow-hidden bg-[#1c1c28] flex items-center justify-center p-3">
        {product.image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <span className="text-gray-600 text-xs">—</span>
        )}
      </div>
      <div className="p-3 flex-1 flex flex-col justify-around">
        <h4 className="text-sm font-medium text-white line-clamp-2 group-hover:text-violet-300 transition-colors">
          {product.name}
        </h4>
        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="text-cyan-400 font-bold text-sm">
            {formatPrice(product.price)}
          </span>
          {product.original_price != null &&
            product.original_price > product.price && (
              <span className="text-gray-500 line-through text-xs">
                {formatPrice(product.original_price)}
              </span>
            )}
        </div>
        {product.rating != null && (
          <span className="text-yellow-400 text-xs mt-0.5">
            ★ {Number(product.rating).toFixed(1)}
          </span>
        )}
        <span className="mt-2 px-3 py-1.5 text-center rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium transition-colors">
          Ver oferta
        </span>
      </div>
    </a>
  );
}

const PRODUCTS_PER_PAGE = 4;

interface Props {
  products: Product[];
}

export default function ProductsRowAdSlider({ products }: Props) {
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const [currentPage, setCurrentPage] = useState(0);

  const start = currentPage * PRODUCTS_PER_PAGE;
  const pageProducts = products.slice(start, start + PRODUCTS_PER_PAGE);

  const goPrev = () => setCurrentPage((p) => (p > 0 ? p - 1 : totalPages - 1));
  const goNext = () => setCurrentPage((p) => (p < totalPages - 1 ? p + 1 : 0));

  return (
    <div className="relative">
      <div className="grid grid-cols-2 gap-4 min-h-[280px]">
        {pageProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 mt-4">
        <button
          type="button"
          onClick={goPrev}
          className="p-2 rounded-lg bg-[#1c1c28] border border-[#2a2a3a] text-gray-400 hover:text-violet-400 hover:border-violet-600/50 transition-colors"
          aria-label="Produtos anteriores"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div className="flex gap-1.5">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentPage(i)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i === currentPage
                  ? "bg-violet-600"
                  : "bg-[#2a2a3a] hover:bg-[#3a3a4a]"
              }`}
              aria-label={`Página ${i + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={goNext}
          className="p-2 rounded-lg bg-[#1c1c28] border border-[#2a2a3a] text-gray-400 hover:text-violet-400 hover:border-violet-600/50 transition-colors"
          aria-label="Próximos produtos"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
