import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import HomePage from "@/app/page";
import { ROUTES, getGenreRoute } from "@/lib/site";

afterEach(() => {
  cleanup();
});

describe("HomePage", () => {
  it("puts real product discovery above the fold and keeps core commerce routes visible", async () => {
    const { container } = render(await HomePage());

    const headings = Array.from(container.querySelectorAll("h2")).map((heading) =>
      heading.textContent?.replace(/\s+/g, " ").trim()
    );

    expect(headings).toContain("公式FANZAにない、ここだけのツール");
    expect(headings).toContain("今月よく見られている作品");
    expect(headings).toContain("値下げ中の作品");
    expect(headings).toContain("ジャンルから探す");

    expect(screen.getByText(/迷ったら、ここで/)).toBeInTheDocument();
    expect(screen.getByText(/人気女優ランキング/)).toBeInTheDocument();
    expect(screen.getAllByText(/値下げ中/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/新着/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/【FANZA限定】人気シリーズ最新作 Vol\.28/).length).toBeGreaterThan(0);
    expect(
      screen.getByRole("link", { name: /作品を検索する/ })
    ).toHaveAttribute("href", ROUTES.search);
    expect(
      container.querySelector(`a[href="${ROUTES.customRanking}"]`)
    ).not.toBeNull();
    expect(
      container.querySelector(`a[href="${ROUTES.weeklySale}"]`)
    ).not.toBeNull();
    expect(screen.getByText(/18歳以上向け/)).toBeInTheDocument();
    expect(screen.getByText(/最新の価格・配信状況はFANZA公式サイトで確認/)).toBeInTheDocument();
    expect(container.querySelector(`a[href="${ROUTES.sale}"]`)).not.toBeNull();
    expect(container.querySelector(`a[href="${getGenreRoute("popular")}"]`)).not.toBeNull();
    expect(
      screen.getAllByRole("link", { name: /FANZAで見る|FANZAで詳細を見る|FANZAで見る/ }).length
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

    expect(screen.getByText(/初回限定クーポンで今すぐお得に/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^セール一覧$/ })).toHaveAttribute(
      "href",
      ROUTES.sale
    );
  });
});
