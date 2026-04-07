import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約",
};

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold mb-8 gradient-text">利用規約</h1>
      <div className="prose-custom space-y-8 text-sm text-[var(--color-text-secondary)] leading-relaxed">
        <p>最終更新日: 2026年3月31日</p>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">第1条（適用）</h2>
          <p>本規約は、FANZAナビ（以下「本サイト」）の利用に関する条件を定めるものです。利用者は、本サイトを利用することにより、本規約に同意したものとみなされます。</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">第2条（本サイトの目的）</h2>
          <p>本サイトは、FANZA（DMM.com）が提供するデジタルコンテンツの情報を紹介するアフィリエイトサイトです。本サイトにはアフィリエイトリンクが含まれており、リンク経由で商品が購入された場合、サイト運営者に報酬が発生することがあります。</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">第3条（年齢制限）</h2>
          <p>本サイトは18歳以上の方のみを対象としています。18歳未満の方のご利用は固くお断りいたします。本サイトにアクセスし利用することにより、利用者は自身が18歳以上であることを表明し保証するものとします。</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">第4条（免責事項）</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>本サイトに掲載されている商品情報（価格、セール情報、レビュー等）は掲載時点のものであり、最新情報については各公式サイトにてご確認ください。</li>
            <li>本サイトの情報に基づいて利用者が行った判断や行動について、サイト運営者は一切の責任を負いません。</li>
            <li>外部リンク先のサービスや商品に関するトラブルについて、サイト運営者は責任を負いません。</li>
            <li>本サイトの運営において、予告なくサービスの中断・終了を行うことがあります。</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">第5条（著作権）</h2>
          <p>本サイトに掲載されているコンテンツ（テキスト、画像、デザイン等）の著作権は、サイト運営者またはそれぞれの権利者に帰属します。商品画像等の著作権は、各コンテンツ提供元に帰属します。無断での複製・転載は禁止します。</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">第6条（禁止事項）</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>本サイトのコンテンツを無断で複製、転載、販売する行為</li>
            <li>本サイトの運営を妨害する行為</li>
            <li>その他、サイト運営者が不適切と判断する行為</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">第7条（規約の変更）</h2>
          <p>サイト運営者は、必要に応じて本規約を変更できるものとします。変更後の規約は、本サイトに掲載した時点で効力を生じるものとします。</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-3">第8条（準拠法・管轄）</h2>
          <p>本規約は日本法に準拠して解釈されるものとし、本サイトに関する紛争については東京地方裁判所を第一審の専属的合意管轄裁判所とします。</p>
        </section>
      </div>
    </main>
  );
}
