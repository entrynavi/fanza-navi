import type { GenreLandingPage } from "@/data/genres";
import { getGenreRoute } from "@/lib/site";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function GenreRail({
  genres,
  currentSlug,
  dense = false,
}: {
  genres: GenreLandingPage[];
  currentSlug?: string;
  dense?: boolean;
}) {
  return (
    <div className={cn("grid gap-3", dense ? "sm:grid-cols-2 xl:grid-cols-4" : "sm:grid-cols-2 xl:grid-cols-3")}>
      {genres.map((genre) => {
        const isCurrent = genre.slug === currentSlug;

        return (
          <a
            key={genre.slug}
            href={getGenreRoute(genre.slug)}
            className={cn(
              "group rounded-[24px] border px-4 py-4 transition-all duration-200",
              isCurrent
                ? "border-[var(--color-primary)]/35 bg-[var(--color-primary)]/10"
                : "border-white/8 bg-white/[0.03] hover:border-[var(--color-primary)]/25 hover:bg-white/[0.05]"
            )}
          >
            <div className="mb-3 flex items-center gap-3">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-2xl text-xl"
                style={{ backgroundColor: `${genre.color}20`, color: genre.color }}
              >
                {genre.icon}
              </span>
              <div>
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">{genre.name}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{genre.headline}</p>
              </div>
            </div>
            <p className="text-sm leading-6 text-[var(--color-text-secondary)]">{genre.highlight}</p>
          </a>
        );
      })}
    </div>
  );
}
