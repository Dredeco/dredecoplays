import Image from "next/image";

interface Props {
  name: string;
  image: string;
  price: string;
  amazonUrl?: string;
  mercadoLivreUrl?: string;
  description?: string;
}

export default function AffiliateCard({
  name,
  image,
  price,
  amazonUrl,
  mercadoLivreUrl,
  description,
}: Props) {
  return (
    <div className="not-prose my-8 flex flex-col sm:flex-row gap-5 bg-surface border border-brand-violet/40 rounded-xl p-5 shadow-lg shadow-violet-950/20">
      <div className="relative w-full sm:w-36 h-36 rounded-lg overflow-hidden shrink-0 bg-surface-2">
        <Image
          src={image}
          alt={name}
          fill
          className="object-contain p-2"
          sizes="144px"
        />
      </div>

      <div className="flex-1 flex flex-col justify-between gap-3">
        <div>
          <h3 className="text-foreground font-bold text-lg leading-tight">{name}</h3>
          {description && (
            <p className="text-muted text-sm mt-1">{description}</p>
          )}
          <p className="text-brand-cyan font-black text-2xl mt-2">{price}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {amazonUrl && (
            <a
              href={amazonUrl}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              className="flex items-center gap-2 bg-[#ff9900] hover:bg-[#e68a00] text-black font-bold px-4 py-2.5 rounded-lg text-sm transition-colors"
            >
              🛒 Ver na Amazon
            </a>
          )}
          {mercadoLivreUrl && (
            <a
              href={mercadoLivreUrl}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              className="flex items-center gap-2 bg-[#ffe600] hover:bg-[#e6d000] text-black font-bold px-4 py-2.5 rounded-lg text-sm transition-colors"
            >
              🛍️ Mercado Livre
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
