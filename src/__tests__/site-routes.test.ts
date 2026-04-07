import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ArticlesPage from "@/app/articles/ArticlesPage";
import NewReleasesPage from "@/app/new/NewReleasesPage";
import { metadata as newRouteMetadata } from "@/app/new/page";
import ActressPage, {
  dynamicParams as actressDynamicParams,
  generateMetadata as generateActressMetadata,
  generateStaticParams as generateActressStaticParams,
} from "@/app/actress/[slug]/page";
import GenrePage, {
  dynamicParams as genreDynamicParams,
  generateMetadata as generateGenreMetadata,
  generateStaticParams as generateGenreStaticParams,
} from "@/app/genre/[slug]/page";
import RankingPage from "@/app/ranking/RankingPage";
import { metadata as rankingRouteMetadata } from "@/app/ranking/page";
import ReviewsIndexPage from "@/app/reviews/page";
import ReviewPage, {
  dynamicParams as reviewDynamicParams,
  generateMetadata as generateReviewMetadata,
  generateStaticParams as generateReviewStaticParams,
} from "@/app/reviews/[slug]/page";
import SalePage from "@/app/sale/SalePage";
import { metadata as saleRouteMetadata } from "@/app/sale/page";
import SearchPage from "@/app/search/SearchPage";
import { metadata as searchRouteMetadata } from "@/app/search/page";
import { genreSlugs } from "@/data/genres";
import { reviewSlugs, reviews } from "@/data/reviews";
import {
  ROUTES,
  getActressRoute,
  getGenreRoute,
  getReviewRoute,
} from "@/lib/site";
import { decodeActressSlug } from "@/lib/actress-ranking";
import { buildAffiliateUrl } from "@/lib/affiliate";

describe("site routes", () => {
  it("builds root-relative routes for genres and reviews", () => {
    expect(ROUTES.genres).toBe("/genre");
    expect(ROUTES.reviews).toBe("/reviews");
    expect(ROUTES.actresses).toBe("/actress");
    expect(getGenreRoute("vr")).toBe("/genre/vr");
    expect(getActressRoute("瀬戸環奈")).toContain("/actress/");
    expect(getReviewRoute("popular-series-latest-review")).toBe(
      "/reviews/popular-series-latest-review"
    );
  });

  it("disables dynamic params and generates static params for every genre and review", async () => {
    const genreParams = await generateGenreStaticParams();
    const reviewParams = await generateReviewStaticParams();
    const actressParams = await generateActressStaticParams();

    expect(genreDynamicParams).toBe(false);
    expect(reviewDynamicParams).toBe(false);
    expect(actressDynamicParams).toBe(false);
    expect(genreParams).toEqual(genreSlugs.map((slug) => ({ slug })));
    expect(reviewParams).toEqual(reviewSlugs.map((slug) => ({ slug })));
    expect(actressParams.length).toBeGreaterThan(0);
    expect(decodeActressSlug(actressParams[0].slug).length).toBeGreaterThan(0);
  });

  it("generates canonical metadata for genre and review pages", async () => {
    const genreMetadata = await generateGenreMetadata({
      params: Promise.resolve({ slug: "vr" }),
    });
    const actressParams = await generateActressStaticParams();
    const actressMetadata = await generateActressMetadata({
      params: Promise.resolve({ slug: actressParams[0].slug }),
    });
    const reviewMetadata = await generateReviewMetadata({
      params: Promise.resolve({ slug: reviews[0].slug }),
    });

    expect(genreMetadata.alternates?.canonical).toBe(getGenreRoute("vr"));
    expect(String(genreMetadata.title)).toContain("VR");
    expect(genreMetadata.description).toContain("VR");
    expect(genreMetadata.twitter?.card).toBe("summary_large_image");

    expect(String(actressMetadata.title)).toContain("作品");
    expect(String(actressMetadata.title)).toContain(decodeActressSlug(actressParams[0].slug));
    expect(actressMetadata.twitter?.card).toBe("summary_large_image");

    expect(reviewMetadata.alternates?.canonical).toBe(getReviewRoute(reviews[0].slug));
    expect(String(reviewMetadata.title)).toContain(reviews[0].title);
    expect(reviewMetadata.description).toContain(reviews[0].excerpt);
    expect(reviewMetadata.twitter?.card).toBe("summary_large_image");
  });

  it("sets discovery metadata for ranking, sale, new, and search routes", () => {
    expect(String(rankingRouteMetadata.title)).toContain("ランキング");
    expect(rankingRouteMetadata.description).toContain("月間");
    expect(rankingRouteMetadata.description).not.toContain("API連携後");
    expect(rankingRouteMetadata.alternates?.canonical).toBe(ROUTES.ranking);
    expect(rankingRouteMetadata.twitter?.card).toBe("summary_large_image");

    expect(String(saleRouteMetadata.title)).toContain("セール");
    expect(saleRouteMetadata.description).toContain("割引");
    expect(saleRouteMetadata.description).not.toContain("更新予定");
    expect(saleRouteMetadata.alternates?.canonical).toBe(ROUTES.sale);

    expect(String(newRouteMetadata.title)).toContain("新作");
    expect(newRouteMetadata.description).toContain("新着");
    expect(newRouteMetadata.alternates?.canonical).toBe(ROUTES.newReleases);

    expect(String(searchRouteMetadata.title)).toContain("検索");
    expect(searchRouteMetadata.description).toContain("入口");
    expect(searchRouteMetadata.description).not.toContain("キーワード");
    expect(searchRouteMetadata.alternates?.canonical).toBe(ROUTES.search);
  });

  it("renders a static genre page with intro copy, review links, and product cards", async () => {
    const page = await GenrePage({
      params: Promise.resolve({ slug: "vr" }),
    });

    render(page);

    expect(screen.getByRole("heading", { level: 1, name: /^VR$/ })).toBeInTheDocument();
    expect(screen.getAllByText(/視聴環境を整えてから選ぶと満足度が上がりやすい/i).length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /比較メモを見る/i })).toHaveAttribute(
      "href",
      getReviewRoute("vr-immersive-viewing-review")
    );
    expect(screen.queryByRole("link", { name: "ジャンル別" })).toBeNull();
    expect(screen.getAllByRole("link", { name: /FANZAのレビューを見る|FANZAで詳細を見る/i }).length).toBeGreaterThan(0);
  });

  it("renders a static review page with affiliate CTA and related products", async () => {
    const page = await ReviewPage({
      params: Promise.resolve({ slug: reviews[0].slug }),
    });

    const { container } = render(page);

    expect(
      screen.getByRole("heading", {
        name: reviews[0].title,
      })
    ).toBeInTheDocument();
    expect(
      screen
        .getAllByRole("link", { name: reviews[0].ctaLabel })
        .some((link) => link.getAttribute("href") === buildAffiliateUrl(reviews[0].destinationUrl))
    ).toBe(true);
    expect(container.querySelector(`a[href="${ROUTES.reviews}"]`)).not.toBeNull();
    expect(screen.getByAltText(/の商品画像$/)).toBeInTheDocument();
    expect(screen.getByText(/流れが近い関連作品/i)).toBeInTheDocument();
  });

  it("renders a review index route for the articles funnel", () => {
    const { container } = render(React.createElement(ReviewsIndexPage));

    expect(screen.getByRole("heading", { name: "比較メモ一覧" })).toBeInTheDocument();
    expect(container.querySelector(`a[href="${getReviewRoute(reviews[0].slug)}"]`)).not.toBeNull();
    expect(container.querySelector(`a[href="${getGenreRoute("popular")}"]`)).not.toBeNull();
  });

  it("renders a monthly ranking page with product cards and related discovery links", async () => {
    const { container } = render(await RankingPage());

    expect(screen.getByRole("heading", { name: "月間ランキング" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "人気女優ランキング" })).toBeInTheDocument();
    expect(screen.getByText(/人気作で迷ったときの比較メモ/i)).toBeInTheDocument();
    expect(screen.queryByText(/準備中/i)).toBeNull();
    expect(container.querySelector(`a[href="${getReviewRoute(reviews[0].slug)}"]`)).not.toBeNull();
    expect(container.querySelector(`a[href="${getGenreRoute("popular")}"]`)).not.toBeNull();
    expect(screen.getAllByRole("link", { name: /FANZAのレビューを見る|FANZAで詳細を見る/i }).length).toBeGreaterThan(0);
  });

  it("renders a static actress page with product cards and ranking links", async () => {
    const actressParams = await generateActressStaticParams();
    const page = await ActressPage({
      params: Promise.resolve({ slug: actressParams[0].slug }),
    });

    const { container } = render(page);
    const actressName = decodeActressSlug(actressParams[0].slug);

    expect(screen.getAllByRole("heading", { name: actressName }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /代表作を見る|FANZAのレビューを見る|FANZAで詳細を見る/i }).length).toBeGreaterThan(0);
    expect(container.querySelector(`a[href="${ROUTES.ranking}"]`)).not.toBeNull();
    expect(container.querySelector(`a[href="${ROUTES.sale}"]`)).not.toBeNull();
  });

  it("renders a real sale page with monetized product cards and review links", async () => {
    const { container } = render(await SalePage());

    expect(screen.getByRole("heading", { name: /セール作品/i })).toBeInTheDocument();
    expect(screen.getByText(/割引率だけでなくレビューと収録内容も見ながら/i)).toBeInTheDocument();
    expect(screen.queryByText(/API連携/i)).toBeNull();
    expect(container.querySelector(`a[href="${getReviewRoute("sale-selection-buying-guide")}"]`)).not.toBeNull();
    expect(container.querySelector(`a[href="${getGenreRoute("sale")}"]`)).not.toBeNull();
    expect(screen.getAllByRole("link", { name: /FANZAのレビューを見る|FANZAで詳細を見る/i }).length).toBeGreaterThan(0);
  });

  it("renders a new releases page with product cards and paths into reviews and genres", async () => {
    const { container } = render(await NewReleasesPage());

    expect(screen.getByRole("heading", { name: /新着リリース/i })).toBeInTheDocument();
    expect(screen.getByText(/配信直後の作品をまとめて追える新着導線/i)).toBeInTheDocument();
    expect(container.querySelector(`a[href="${getGenreRoute("new-release")}"]`)).not.toBeNull();
    expect(container.querySelector(`a[href="${getGenreRoute("vr")}"]`)).not.toBeNull();
    expect(container.querySelector(`a[href="${ROUTES.reviews}"]`)).not.toBeNull();
    expect(screen.getAllByRole("link", { name: /FANZAのレビューを見る|FANZAで詳細を見る/i }).length).toBeGreaterThan(0);
  });

  it("renders a static search-entry page with curated routes and monetized products", async () => {
    const { container } = render(await SearchPage());

    expect(screen.getByRole("heading", { name: /作品検索の入口/i })).toBeInTheDocument();
    expect(screen.getByText(/静的サイトでも迷わず探せるように/i)).toBeInTheDocument();
    expect(screen.queryByText(/準備中/i)).toBeNull();
    expect(container.querySelector(`a[href="${getGenreRoute("popular")}"]`)).not.toBeNull();
    expect(container.querySelector(`a[href="${getGenreRoute("sale")}"]`)).not.toBeNull();
    expect(container.querySelector(`a[href="${ROUTES.reviews}"]`)).not.toBeNull();
    expect(screen.getAllByRole("link", { name: /FANZAのレビューを見る|FANZAで詳細を見る/i }).length).toBeGreaterThan(0);
  });

  it("adds review funnel links to the articles discovery page", () => {
    const { container } = render(React.createElement(ArticlesPage));

    expect(
      screen
        .getAllByRole("link", { name: /レビュー一覧へ/i })
        .some((link) => link.getAttribute("href") === ROUTES.reviews)
    ).toBe(true);
    expect(container.querySelector(`a[href="${getReviewRoute(reviews[0].slug)}"]`)).not.toBeNull();
    expect(container.querySelector(`a[href="${getGenreRoute("vr")}"]`)).not.toBeNull();
  });
});
