interface Props {
  position: "top" | "mid-content" | "mid-article" | "footer" | "sidebar";
  className?: string;
}

const dimensions: Record<Props["position"], { width: number; height: number; label: string }> = {
  top: { width: 728, height: 90, label: "Leaderboard 728×90" },
  "mid-content": { width: 728, height: 90, label: "Leaderboard 728×90" },
  "mid-article": { width: 336, height: 280, label: "Retângulo 336×280" },
  footer: { width: 728, height: 90, label: "Leaderboard 728×90" },
  sidebar: { width: 300, height: 250, label: "Retângulo 300×250" },
};

export default function AdSlot({ position, className = "" }: Props) {
  const { width, height, label } = dimensions[position];

  return (
    <div className={`flex justify-center ${className}`}>
      {/* ADSENSE SLOT — substituir o conteúdo abaixo pelo script do Google AdSense */}
      <div
        style={{ width: `min(${width}px, 100%)`, height: `${height}px` }}
        className="bg-[#13131a] border border-dashed border-[#2a2a3a] rounded-lg flex flex-col items-center justify-center gap-1"
        aria-label="Espaço publicitário"
      >
        <span className="text-[#6b6b8a] text-xs font-medium uppercase tracking-wider">
          Anúncio
        </span>
        <span className="text-[#2a2a3a] text-xs">{label}</span>
      </div>
    </div>
  );
}
