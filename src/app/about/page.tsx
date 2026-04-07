import type { Metadata } from "next";
import { FaEnvelope, FaGlobe, FaShieldAlt } from "react-icons/fa";
import { ROUTES, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "運営者情報",
};

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold mb-8 gradient-text">運営者情報</h1>

      <div className="glass-card p-8 mb-8">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-[var(--color-border)]">
            <tr>
              <td className="py-4 pr-4 font-bold text-white w-1/3">サイト名</td>
              <td className="py-4 text-[var(--color-text-secondary)]">
                オトナビ
              </td>
            </tr>
            <tr>
              <td className="py-4 pr-4 font-bold text-white">サイトURL</td>
              <td className="py-4 text-[var(--color-text-secondary)]">
                <a href={SITE_URL} className="text-[var(--color-primary)] hover:underline">
                  {SITE_URL}
                </a>
              </td>
            </tr>
            <tr>
              <td className="py-4 pr-4 font-bold text-white">運営形態</td>
              <td className="py-4 text-[var(--color-text-secondary)]">個人運営</td>
            </tr>
            <tr>
              <td className="py-4 pr-4 font-bold text-white">お問い合わせ</td>
              <td className="py-4 text-[var(--color-text-secondary)]">
                <a href={ROUTES.contact} className="text-[var(--color-primary)] hover:underline">
                  お問い合わせフォーム
                </a>
                よりご連絡ください
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-5 text-center">
          <FaGlobe size={24} className="text-blue-400 mx-auto mb-3" />
          <h3 className="font-bold text-sm mb-1">サイトについて</h3>
          <p className="text-xs text-[var(--color-text-secondary)]">
            FANZAの使い方・お得情報をわかりやすく解説するガイドメディアです
          </p>
        </div>
        <div className="glass-card p-5 text-center">
          <FaShieldAlt size={24} className="text-green-400 mx-auto mb-3" />
          <h3 className="font-bold text-sm mb-1">アフィリエイト</h3>
          <p className="text-xs text-[var(--color-text-secondary)]">
            DMM.comアフィリエイトプログラムに参加しています
          </p>
        </div>
        <div className="glass-card p-5 text-center">
          <FaEnvelope size={24} className="text-purple-400 mx-auto mb-3" />
          <h3 className="font-bold text-sm mb-1">お問い合わせ</h3>
          <p className="text-xs text-[var(--color-text-secondary)]">
            ご質問・ご要望はお問い合わせフォームまで
          </p>
        </div>
      </div>

      <div className="glass-card p-6 border-[var(--color-primary)]/20">
        <h2 className="font-bold mb-3">📋 特定商取引法に基づく表記</h2>
        <table className="w-full text-sm">
          <tbody className="divide-y divide-[var(--color-border)]">
            <tr>
              <td className="py-3 pr-4 font-bold text-white w-1/3">販売形態</td>
              <td className="py-3 text-[var(--color-text-secondary)]">
                アフィリエイト（商品の販売は各提携先サイトにて行われます）
              </td>
            </tr>
            <tr>
              <td className="py-3 pr-4 font-bold text-white">商品の引渡し</td>
              <td className="py-3 text-[var(--color-text-secondary)]">
                各提携先サイトの規定に準じます
              </td>
            </tr>
            <tr>
              <td className="py-3 pr-4 font-bold text-white">返品・キャンセル</td>
              <td className="py-3 text-[var(--color-text-secondary)]">
                各提携先サイトの規定に準じます
              </td>
            </tr>
            <tr>
              <td className="py-3 pr-4 font-bold text-white">個人情報の取扱い</td>
              <td className="py-3 text-[var(--color-text-secondary)]">
                <a href={ROUTES.privacy} className="text-[var(--color-primary)] hover:underline">
                  プライバシーポリシー
                </a>
                をご参照ください
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}
