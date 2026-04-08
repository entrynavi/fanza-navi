import type { Metadata } from "next";
import SimulatorPage from "./SimulatorPage";
import { buildPageMetadata } from "@/lib/metadata";
import { ROUTES } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "月額 vs 単品 お得度シミュレーター",
  description:
    "月額見放題と単品購入、どちらがお得かシミュレーション。視聴本数と平均単価から最適プランを診断。",
  path: ROUTES.simulator,
});

export default function Page() {
  return <SimulatorPage />;
}
