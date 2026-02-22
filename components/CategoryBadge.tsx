import Link from "next/link";
import { slugify } from "@/lib/posts";

const categoryColors: Record<string, string> = {
  reviews: "bg-orange-500 text-white",
  noticias: "bg-blue-600 text-white",
  "guias-dicas": "bg-green-600 text-white",
  "rpg-soulslike": "bg-violet-600 text-white",
  "indie-games": "bg-cyan-500 text-black",
  playstation: "bg-blue-700 text-white",
  "xbox-pc": "bg-green-700 text-white",
  "fps-acao": "bg-red-600 text-white",
  "listas-rankings": "bg-yellow-500 text-black",
  nintendo: "bg-red-500 text-white",
};

type CategoryProp = string | { name: string; slug?: string; color?: string };

interface Props {
  category: CategoryProp;
  asLink?: boolean;
  size?: "sm" | "md";
}

export default function CategoryBadge({ category, asLink = true, size = "sm" }: Props) {
  const name = typeof category === "string" ? category : category.name;
  const slug = typeof category === "string" ? slugify(category) : category.slug ?? slugify(category.name);
  const hexColor = typeof category === "object" && category.color ? category.color : undefined;

  const colorClass = hexColor
    ? ""
    : (categoryColors[slug] ?? "bg-violet-700 text-white");
  const sizeClass = size === "md" ? "text-sm px-3 py-1" : "text-xs px-2.5 py-0.5";
  const baseClasses = `inline-block ${sizeClass} rounded font-bold uppercase tracking-wide`;
  const classes = hexColor ? `${baseClasses}` : `${baseClasses} ${colorClass}`;
  const style = hexColor ? { backgroundColor: hexColor, color: "#fff" } : undefined;

  if (asLink) {
    return (
      <Link
        href={`/categoria/${slug}`}
        className={`${classes} hover:opacity-90 transition-opacity`}
        style={style}
      >
        {name}
      </Link>
    );
  }

  return (
    <span className={classes} style={style}>
      {name}
    </span>
  );
}
