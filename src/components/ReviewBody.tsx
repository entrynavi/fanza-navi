import PrimaryCta from "@/components/PrimaryCta";
import type { Review } from "@/data/reviews";

function renderParagraphs(paragraphs: string[]) {
  return paragraphs.map((paragraph) => (
    <p key={paragraph} className="text-[15px] leading-8 text-[var(--color-text-secondary)]">
      {paragraph}
    </p>
  ));
}

export default function ReviewBody({
  review,
  ctaHref,
}: {
  review: Review;
  ctaHref: string;
}) {
  return (
    <div className="space-y-8">
      <div className="editorial-panel p-6">
        <p className="text-base leading-8 text-[var(--color-text-primary)]">{review.lead}</p>
      </div>

      <div className="rounded-[24px] border border-[var(--color-border-strong)] bg-[var(--color-surface-highlight)] px-5 py-4">
        <p className="text-xs font-medium tracking-[0.12em] text-[var(--color-accent)] uppercase">
          先に結論
        </p>
        <p className="mt-2 text-sm leading-7 text-[var(--color-text-primary)]">{review.verdict}</p>
      </div>

      {review.bodySections.map((section, index) => (
        <section key={section.heading} className="space-y-4">
          <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            {section.heading}
          </h2>
          {renderParagraphs(section.paragraphs)}
          {index === 0 ? (
            <div className="editorial-panel p-6">
              <p className="text-xs font-medium tracking-[0.12em] text-[var(--color-accent)] uppercase">
                気になったらここで確認
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--color-text-secondary)]">
                {review.ctaNote}
              </p>
              <div className="mt-4">
                <PrimaryCta href={ctaHref} external>
                  {review.ctaLabel}
                </PrimaryCta>
              </div>
            </div>
          ) : null}
        </section>
      ))}

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">こういう人に合いやすい</h3>
          <ul className="mt-3 space-y-2 text-sm leading-7 text-[var(--color-text-secondary)]">
            {review.bestFor.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">先に見ておきたい点</h3>
          <ul className="mt-3 space-y-2 text-sm leading-7 text-[var(--color-text-secondary)]">
            {review.cautions.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
