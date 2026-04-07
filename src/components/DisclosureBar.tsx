const DISCLOSURE_TEXT =
  "当サイトはDMMアフィリエイトを利用しています。商品情報・価格は記事執筆時点のものです。最新の価格・配信状況はFANZA公式サイトでご確認ください。";

export default function DisclosureBar() {
  return (
    <div className="sticky top-0 z-50">
      <div
        role="note"
        aria-label="アフィリエイト開示"
        className="border-b border-[var(--color-border)] bg-[rgba(9,10,13,0.94)] px-4 py-2 text-center text-[11px] leading-relaxed text-[var(--color-text-secondary)] backdrop-blur-xl"
      >
        {DISCLOSURE_TEXT}
      </div>
    </div>
  );
}
