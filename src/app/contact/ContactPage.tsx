"use client";

import { useState } from "react";
import { FaEnvelope, FaExclamationTriangle, FaPaperPlane, FaRegClock } from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";
import SectionIntro from "@/components/SectionIntro";

const NOTICE_ITEMS = [
  "購入、返金、アカウント、配信停止などの個別対応は DMM / FANZA 公式サポートをご利用ください。",
  "記事内容の誤り、リンク切れ、表示崩れの連絡は優先して確認します。",
  "広告掲載やメディア連携の相談は、概要がわかる内容だと返答しやすいです。",
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `【お名前】${name}\n【メールアドレス】${email}\n\n${message}`;
    const mailtoUrl = `mailto:entrynavi.contact@gmail.com?subject=${encodeURIComponent(
      `[FANZAナビ] ${subject}`
    )}&body=${encodeURIComponent(body)}`;

    window.open(mailtoUrl, "_blank");
    setSent(true);
  };

  return (
    <main className="content-shell px-4 py-8">
      <Breadcrumb items={[{ label: "お問い合わせ" }]} />

      <section className="editorial-surface p-6 md:p-8">
        <SectionIntro
          eyebrow="お問い合わせ"
          title="お問い合わせ"
          description="記事内容の誤り、リンク切れ、表示不具合、運営に関する連絡はこちらからどうぞ。購入やアカウントの相談は公式サポートをご利用ください。"
        />

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-surface-highlight)] text-[var(--color-accent)]">
              <FaEnvelope size={16} />
            </div>
            <p className="mt-4 text-xs font-medium tracking-[0.14em] text-[var(--color-text-muted)] uppercase">
              お問い合わせ
            </p>
            <h2 className="mt-2 text-xl font-semibold text-[var(--color-text-primary)]">
              メーラー起動型
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
              送信ボタンを押すとメールアプリが起動します。内容を確認して、そのまま送信してください。
            </p>
          </div>

          <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-surface-highlight)] text-[var(--color-accent)]">
              <FaRegClock size={16} />
            </div>
            <p className="mt-4 text-xs font-medium tracking-[0.14em] text-[var(--color-text-muted)] uppercase">
              Response
            </p>
            <h2 className="mt-2 text-xl font-semibold text-[var(--color-text-primary)]">
              通常3営業日以内
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
              内容によって前後しますが、修正依頼や不具合報告は早めに確認するようにしています。
            </p>
          </div>

          <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-surface-highlight)] text-[var(--color-accent)]">
              <FaExclamationTriangle size={16} />
            </div>
            <p className="mt-4 text-xs font-medium tracking-[0.14em] text-[var(--color-text-muted)] uppercase">
              Official Support
            </p>
            <h2 className="mt-2 text-xl font-semibold text-[var(--color-text-primary)]">
              公式窓口が必要な相談もあります
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
              購入や会員情報に関する問い合わせは、当サイトでは確認できません。DMM/FANZA 公式ヘルプをご利用ください。
            </p>
          </div>
        </div>
      </section>

      <section className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="editorial-panel p-6 md:p-7">
          <SectionIntro
            eyebrow="お問い合わせ"
            title="連絡内容を入力してください"
            description="お名前、連絡先、件名、本文を入れると、内容を反映したメール作成画面が開きます。"
          />

          {sent ? (
            <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
                メールアプリを起動しました
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--color-text-secondary)]">
                内容を確認して、そのまま送信してください。未送信のまま閉じた場合は、もう一度このページから開けます。
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-6 inline-flex items-center rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-border-strong)]"
              >
                もう一度入力する
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-[var(--color-text-primary)]">
                    お名前
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="山田 太郎"
                    className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-border-strong)] focus:outline-none"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-[var(--color-text-primary)]">
                    メールアドレス
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-border-strong)] focus:outline-none"
                  />
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-[var(--color-text-primary)]">
                  件名
                </span>
                <select
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-border-strong)] focus:outline-none"
                >
                  <option value="" className="bg-[var(--color-bg-dark)]">
                    選択してください
                  </option>
                  <option value="記事内容について" className="bg-[var(--color-bg-dark)]">
                    記事内容の誤り・修正依頼
                  </option>
                  <option value="サイトの不具合" className="bg-[var(--color-bg-dark)]">
                    サイトの不具合報告
                  </option>
                  <option value="広告・メディア連携" className="bg-[var(--color-bg-dark)]">
                    広告掲載・メディア連携のご相談
                  </option>
                  <option value="その他" className="bg-[var(--color-bg-dark)]">
                    その他のお問い合わせ
                  </option>
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-[var(--color-text-primary)]">
                  お問い合わせ内容
                </span>
                <textarea
                  required
                  rows={7}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="確認してほしいページや状況がある場合は、URL や発生条件も書いてください。"
                  className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm leading-7 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-border-strong)] focus:outline-none"
                />
              </label>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary)] to-[var(--color-accent)] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(158,68,90,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_45px_rgba(158,68,90,0.32)]"
              >
                <FaPaperPlane size={13} />
                メールを作成する
              </button>
            </form>
          )}
        </div>

        <aside className="editorial-surface p-6 md:p-7">
          <SectionIntro
            eyebrow="送信前に"
            title="送信前に確認しておきたいこと"
            description="問い合わせ内容によって、当サイトで対応できるものと、公式サポートが必要なものがあります。"
          />

          <div className="space-y-3">
            {NOTICE_ITEMS.map((item) => (
              <div
                key={item}
                className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 text-sm leading-7 text-[var(--color-text-secondary)]"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">
              DMM/FANZA 公式ヘルプ
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
              購入履歴、返金、配信停止、ログイン情報の確認は、公式ヘルプの方が確実です。
            </p>
            <a
              href="https://www.dmm.com/help/"
              target="_blank"
              rel="noreferrer noopener"
              className="mt-5 inline-flex items-center rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-border-strong)]"
            >
              DMM公式ヘルプを見る
            </a>
          </div>
        </aside>
      </section>
    </main>
  );
}
