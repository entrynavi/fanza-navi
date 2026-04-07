interface RelatedNavigationItem {
  href: string;
  title: string;
  description: string;
  eyebrow?: string;
}

export default function RelatedNavigation({
  title,
  description,
  items,
}: {
  title: string;
  description?: string;
  items: RelatedNavigationItem[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 editorial-surface p-6 md:p-7">
      <div className="mb-5 max-w-2xl">
        <p className="section-eyebrow">関連コンテンツ</p>
        <h2 className="section-title text-[1.6rem]">{title}</h2>
        {description ? <p className="section-description">{description}</p> : null}
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-colors hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-strong)]"
          >
            {item.eyebrow ? (
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
                {item.eyebrow}
              </p>
            ) : null}
            <h3 className="mb-2 text-base font-semibold text-[var(--color-text-primary)]">{item.title}</h3>
            <p className="text-sm leading-6 text-[var(--color-text-secondary)]">{item.description}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
