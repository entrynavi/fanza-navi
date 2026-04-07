import type { Metadata } from "next";
import PaymentGuidePage from "./PaymentGuidePage";
import { buildArticleMetadata } from "@/lib/metadata";
import { ROUTES } from "@/lib/site";

export const metadata: Metadata = buildArticleMetadata({
  title:
    "FANZA（DMM）の支払い方法を完全解説！クレジットカード・PayPay・DMMポイントを比較",
  description:
    "FANZAで使える全支払い方法をクレジットカード・DMMポイント・PayPay・キャリア決済・コンビニ払いなど徹底比較。バレない方法や手数料、おすすめの支払い手段を状況別に解説します。",
  path: ROUTES.articleFanzaPayment,
});

export default function Page() {
  return <PaymentGuidePage />;
}
