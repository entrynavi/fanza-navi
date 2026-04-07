import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import HomePage from "@/app/page";
import { ROUTES, getGenreRoute, getReviewRoute } from "@/lib/site";
import { reviews } from "@/data/reviews";

afterEach(() => {
  cleanup();
});

describe("HomePage", () => {
  it("puts real product discovery above the fold and keeps core commerce routes visible", async () => {
    const { container } = render(await HomePage());

    const headings = Array.from(container.querySelectorAll("h2")).map((heading) =>
      heading.textContent?.replace(/\s+/g, " ").trim()
    );

    expect(headings).toContain("今月よく見られている作品");
    expect(headings).toContain("値下げ中の作品");
    expect(headings).toContain("ジャンルから探す");
    expect(headings).toContain("迷ったときの比較メモ");
    expect(headings).toContain("支払い方法や比較記事も見ておけます");

    expect(screen.getByText(/人気作から探す/)).toBeInTheDocument();
    expect(screen.getByText(/人気女優ランキング/)).toBeInTheDocument();
    expect(screen.getAllByText(/人気1位/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/値下げ中/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/新着/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/【FANZA限定】人気シリーズ最新作 Vol\.28/).length).toBeGreaterThan(0);
    expect(
      screen.getByRole("link", { name: /ランキングから見る/ })
    ).toHaveAttribute("href", ROUTES.ranking);
    expect(screen.getByRole("link", { name: /セールから見る/ })).toHaveAttribute(
      "href",
      ROUTES.sale
    );
    expect(screen.getByRole("link", { name: /新作を見る/ })).toHaveAttribute(
      "href",
      ROUTES.newReleases
    );
    expect(screen.getByText(/18歳以上向け/)).toBeInTheDocument();
    expect(screen.getByText(/最新の価格・配信状況はFANZA公式サイトで確認/)).toBeInTheDocument();
    expect(container.querySelector(`a[href="${ROUTES.sale}"]`)).not.toBeNull();
    expect(container.querySelector(`a[href="${getGenreRoute("popular")}"]`)).not.toBeNull();
    expect(container.querySelector(`a[href="${getReviewRoute(reviews[0].slug)}"]`)).not.toBeNull();
    expect(container.querySelector(`a[href="${ROUTES.articles}"]`)).not.toBeNull();
    expect(
      screen.getAllByRole("link", { name: /FANZAのレビューを見る|FANZAで詳細を見る|FANZAで見る/ }).length
    ).toBeGreaterThan(0);
  });

  it("uses the sticky CTA to send scrolled visitors to sale", async () => {
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      writable: true,
      value: 480,
    });

    render(await HomePage());
    fireEvent.scroll(window);

    expect(screen.getByText(/今回はセール対象を先に見たい人向け/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /セール一覧を見る/ })).toHaveAttribute(
      "href",
      ROUTES.sale
    );
  });
});
