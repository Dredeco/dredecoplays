interface Props {
  author: {
    name: string;
    avatar?: string | null;
    bio?: string;
  };
}

/** Bio visível para leitores e microdata Person (E-E-A-T). Só renderiza com nome e (bio ou avatar). */
export default function AuthorBio({ author }: Props) {
  const hasBio = Boolean(author.bio?.trim());
  const hasAvatar = Boolean(author.avatar?.trim());

  if (!author.name || (!hasBio && !hasAvatar)) {
    return null;
  }

  return (
    <div
      className="author-bio mt-10 pt-8 border-t border-border flex gap-4 items-start"
      itemScope
      itemType="https://schema.org/Person"
    >
      {hasAvatar && (
        // eslint-disable-next-line @next/next/no-img-element -- URLs externas da API
        <img
          src={author.avatar!}
          alt={author.name}
          itemProp="image"
          width={64}
          height={64}
          className="rounded-full object-cover shrink-0"
        />
      )}
      <div>
        <strong className="text-foreground" itemProp="name">
          {author.name}
        </strong>
        {hasBio && (
          <p className="text-muted text-sm mt-2 leading-relaxed" itemProp="description">
            {author.bio}
          </p>
        )}
      </div>
    </div>
  );
}
