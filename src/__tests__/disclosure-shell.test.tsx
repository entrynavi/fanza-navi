import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/JsonLd", () => ({
  default: () => null,
  JsonLd: () => null,
}));

vi.mock("@/components/Analytics", () => ({
  default: () => null,
}));

vi.mock("@/components/ErrorTracker", () => ({
  default: () => null,
}));

vi.mock("@/components/AgeGate", () => ({
  default: () => null,
}));

import RootLayout from "@/app/layout";

describe("RootLayout disclosure shell", () => {
  it("renders the required affiliate disclosure text", () => {
    const markup = renderToStaticMarkup(
      <RootLayout>
        <main>content</main>
      </RootLayout>
    );

    expect(markup).toContain(
      "当サイトはDMMアフィリエイトを利用しています。商品情報・価格は記事執筆時点のものです。最新の価格・配信状況はFANZA公式サイトでご確認ください。"
    );
    expect(markup).toContain('aria-label="アフィリエイト開示"');
    expect(markup).toContain('class="sticky top-0 z-50"');
    expect(markup).toContain("ランキング");
    expect(markup).toContain("セール");
    expect(markup).toContain("探すラボ");
    expect(markup).toContain("買う前チェック");
    expect(markup).toContain("記事一覧");
    expect(markup).toContain("初心者ガイド");
    expect(markup).toContain("検索入口");
  });
});
