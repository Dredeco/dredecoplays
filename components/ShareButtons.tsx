"use client";

import { useState } from "react";

interface Props {
  title: string;
  url: string;
}

export default function ShareButtons({ title, url }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`;

  return (
    <div className="flex flex-wrap items-center gap-3 mt-10 pt-6 border-t border-[#2a2a3a]">
      <span className="text-sm text-gray-400 font-medium">Compartilhar:</span>

      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-medium px-4 py-2 rounded-full text-sm transition-colors"
      >
        𝕏 Twitter
      </a>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-full text-sm transition-colors"
      >
        💬 WhatsApp
      </a>

      <button
        onClick={handleCopy}
        className="flex items-center gap-2 bg-[#1c1c28] hover:bg-[#2a2a3a] text-gray-300 hover:text-white font-medium px-4 py-2 rounded-full text-sm transition-colors border border-[#2a2a3a]"
      >
        {copied ? "✓ Copiado!" : "🔗 Copiar link"}
      </button>
    </div>
  );
}
