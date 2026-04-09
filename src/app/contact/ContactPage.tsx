"use client";

import { useMemo, useState } from "react";
import {
  FaEnvelope,
  FaExclamationTriangle,
  FaPaperPlane,
  FaRegClock,
  FaShieldAlt,
} from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";
import SectionIntro from "@/components/SectionIntro";
import { createContactSubmission, hasWorkersApi } from "@/lib/workers-api";

const NOTICE_ITEMS = [
  "購入、返金、アカウント、配信停止などの個別対応は DMM / FANZA 公式サポートをご利用ください。",
  "記事内容の誤り、リンク切れ、表示崩れの連絡は優先して確認します。",
  "新機能の要望は、使う場面や欲しい理由まであると反映しやすいです。",
];

const SUBJECT_OPTIONS = [
  "記事内容の誤り・修正依頼",
  "サイトの不具合報告",
  "新機能リクエスト・要望",
  "広告掲載・メディア連携のご相談",
  "その他のお問い合わせ",
];

export default function ContactPage() {
  const workersAvailable = useMemo(() => hasWorkersApi(), []);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!workersAvailable) {
      setErrorMessage("現在は問い合わせ受付の接続設定を確認中です。時間をおいて再度お試しください。");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await createContactSubmission({
        name,
        email,
        subject,
        message,
      });
      setSent(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "送信に失敗しました。時間をおいて再度お試しください。"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="content-shell px-4 py-8">
      <Breadcrumb items={[{ label: "お問い合わせ" }]} />

      <section className="editorial-surface p-6 md:p-8">
        <SectionIntro
          eyebrow="お問い合わせ"
          title="お問い合わせ"
          description="記事内容の誤り、リンク切れ、表示不具合、運営への要望はこちらからどうぞ。運営側のメールアドレスを公開せずに送信できるフォームにしています。"
        />

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-surface-highlight)] text-[var(--color-accent)]">
              <FaEnvelope size={16} />
            </div>
            <p className="mt-4 text-xs font-medium tracking-[0.14em] text-[var(--color-text-muted)] uppercase">
              受付方法
            </p>
            <h2 className="mt-2 text-xl font-semibold text-[var(--color-text-primary)]">
              フォーム送信型
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
              このページからそのまま送信できます。メールアプリの起動は不要です。
            </p>
          </div>

          <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-surface-highlight)] text-[var(--color-accent)]">
              <FaShieldAlt size={16} />
            </div>
            <p className="mt-4 text-xs font-medium tracking-[0.14em] text-[var(--color-text-muted)] uppercase">
              プライバシー
            </p>
            <h2 className="mt-2 text-xl font-semibold text-[var(--color-text-primary)]">
              運営メールは非公開
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
              フォーム経由で受け付けるため、運営者のメールアドレスはページ上に出しません。
            </p>
          </div>

          <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-surface-highlight)] text-[var(--color-accent)]">
              <FaRegClock size={16} />
            </div>
            <p className="mt-4 text-xs font-medium tracking-[0.14em] text-[var(--color-text-muted)] uppercase">
              返信目安
            </p>
            <h2 className="mt-2 text-xl font-semibold text-[var(--color-text-primary)]">
              通常3営業日以内
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
              返信が必要な場合はメールアドレスを入れてください。匿名送信も可能です。
            </p>
          </div>
        </div>
      </section>

      <section className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="editorial-panel p-6 md:p-7">
          <SectionIntro
            eyebrow="お問い合わせ"
            title="内容を入力してください"
            description="件名と本文は必須です。返信が必要な場合だけメールアドレスを入力してください。"
          />

          {sent ? (
            <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
                送信を受け付けました
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--color-text-secondary)]">
                内容を確認のうえ、必要に応じて対応します。返信が必要な場合は、入力いただいた連絡先にお返しします。
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-6 inline-flex items-center rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-border-strong)]"
              >
                もう一度送る
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-[var(--color-text-primary)]">
                    お名前・ニックネーム
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="匿名でも構いません"
                    className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-border-strong)] focus:outline-none"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-[var(--color-text-primary)]">
                    メールアドレス（任意）
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="返信が欲しい場合のみ"
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
                  onChange={(event) => setSubject(event.target.value)}
                  className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-border-strong)] focus:outline-none"
                >
                  <option value="" className="bg-[var(--color-bg-dark)]">
                    選択してください
                  </option>
                  {SUBJECT_OPTIONS.map((option) => (
                    <option key={option} value={option} className="bg-[var(--color-bg-dark)]">
                      {option}
                    </option>
                  ))}
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
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="確認してほしいページや状況がある場合は、URL や発生条件も書いてください。"
                  className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm leading-7 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-border-strong)] focus:outline-none"
                />
              </label>

              {!workersAvailable ? (
                <div className="rounded-[18px] border border-[var(--color-accent)]/25 bg-[var(--color-accent)]/8 px-4 py-3 text-sm leading-7 text-[var(--color-text-secondary)]">
                  問い合わせフォームの送信先を接続中です。反映後はこのページから直接送れるようになります。
                </div>
              ) : null}

              {errorMessage ? (
                <div className="rounded-[18px] border border-[var(--color-primary)]/25 bg-[var(--color-primary)]/10 px-4 py-3 text-sm leading-7 text-[var(--color-text-secondary)]">
                  {errorMessage}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary)] to-[var(--color-accent)] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(158,68,90,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_45px_rgba(158,68,90,0.32)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FaPaperPlane size={13} />
                {isSubmitting ? "送信中..." : "問い合わせを送信する"}
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
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-surface-highlight)] text-[var(--color-accent)]">
              <FaExclamationTriangle size={16} />
            </div>
            <p className="mt-4 text-sm font-semibold text-[var(--color-text-primary)]">
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
