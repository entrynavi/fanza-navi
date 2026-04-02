"use client";

import { FaHeart } from "react-icons/fa";
import { ROUTES } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] mt-20">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Disclaimer */}
        <div className="glass-card p-6 mb-8 border-[var(--color-primary)]/20">
          <h4 className="font-bold text-sm mb-2 text-[var(--color-primary)]">
            ⚠️ 免責事項・注意事項
          </h4>
          <div className="text-xs text-[var(--color-text-secondary)] space-y-1 leading-relaxed">
            <p>
              ※ 本サイトはアフィリエイトプログラムに参加しています。リンク経由での購入により、サイト運営者に報酬が発生する場合があります。
            </p>
            <p>※ 価格・セール情報は掲載時点のものです。最新情報は公式サイトでご確認ください。</p>
            <p>※ 本サイトは18歳未満の方のご利用を固くお断りします。</p>
            <p>※ 掲載している画像・情報の著作権はそれぞれの権利者に帰属します。</p>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm text-[var(--color-text-secondary)]">
          <a href={ROUTES.privacy} className="hover:text-[var(--color-primary)] transition-colors">
            プライバシーポリシー
          </a>
          <a href={ROUTES.terms} className="hover:text-[var(--color-primary)] transition-colors">
            利用規約
          </a>
          <a href={ROUTES.about} className="hover:text-[var(--color-primary)] transition-colors">
            運営者情報
          </a>
          <a href={ROUTES.contact} className="hover:text-[var(--color-primary)] transition-colors">
            お問い合わせ
          </a>
          <a href={ROUTES.guide} className="hover:text-[var(--color-primary)] transition-colors">
            初心者ガイド
          </a>
        </div>

        {/* Copyright */}
        <p className="text-center text-xs text-[var(--color-text-secondary)]">
          Made with <FaHeart className="inline text-[var(--color-primary)] mx-1" size={10} /> ©{" "}
          {new Date().getFullYear()} FANZAおすすめナビ
        </p>
      </div>
    </footer>
  );
}
