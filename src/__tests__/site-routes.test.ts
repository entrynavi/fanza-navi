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
import MakerPage, {
  dynamicParams as makerDynamicParams,
  generateMetadata as generateMakerMetadata,
  generateStaticParams as generateMakerStaticParams,
} from "@/app/maker/[slug]/page";
import GenrePage, {
  dynamicParams as genreDynamicParams,
  generateMetadata as generateGenreMetadata,
  generateStaticParams as generateGenreStaticParams,
} from "@/app/genre/[slug]/page";
import RankingPage from "@/app/ranking/RankingPage";
import { metadata as rankingRouteMetadata } from "@/app/ranking/page";
import SeriesPage, {
  dynamicParams as seriesDynamicParams,
  generateMetadata as generateSeriesMetadata,
  generateStaticParams as generateSeriesStaticParams,
} from "@/app/series/[slug]/page";
import SalePage from "@/app/sale/SalePage";
import { metadata as saleRouteMetadata } from "@/app/sale/page";
import SearchRoutePage, { metadata as searchRouteMetadata } from "@/app/search/page";
import { genreSlugs } from "@/data/genres";
import { decodeEntitySlug } from "@/lib/entity-ranking";
import {
  ROUTES,
  getActressRoute,
  getGenreRoute,
  getMakerRoute,
  getSeriesRoute,
} from "@/lib/site";
import { decodeActressSlug } from "@/lib/actress-ranking";

describe("site routes", () => {
  it("builds root-relative routes for genres and entity pages", () => {
    expect(ROUTES.genres).toBe("/genre");
    expect(ROUTES.actresses).toBe("/actress");
    expect(ROUTES.makers).toBe("/maker");
    expect(ROUTES.series).toBe("/series");
    expect(getGenreRoute("vr")).toBe("/genre/vr");
    expect(getActressRoute("瀬戸環奈")).toContain("/actress/");
    expect(getMakerRoute("MOODYZ")).toContain("/maker/");
    expect(getSeriesRoute("王道ヒットコレクション")).toContain("/series/");
  });

  it("disables dynamic params and generates static params for every genre and entity", async () => {
    const genreParams = await generateGenreStaticParams();
    const actressParams = await generateActressStaticParams();
    const makerParams = await generateMakerStaticParams();
    const seriesParams = await generateSeriesStaticParams();

    expect(genreDynamicParams).toBe(false);
    expect(actressDynamicParams).toBe(false);
    expect(makerDynamicParams).toBe(false);
    expect(seriesDynamicParams).toBe(false);
    expect(genreParams).toEqual(genreSlugs.map((slug) => ({ slug })));
    expect(actressParams.length).toBeGreaterThan(0);
    expect(makerParams.length).toBeGreaterThan(0);
    expect(seriesParams.length).toBeGreaterThan(0);
    expect(decodeActressSlug(actressParams[0].slug).length).toBeGreaterThan(0);
    expect(decodeEntitySlug(makerParams[0].slug).length).toBeGreaterThan(0);
    expect(decodeEntitySlug(seriesParams[0].slug).length).toBeGreaterThan(0);
  });

  it("generates canonical metadata for genre and entity pages", async () => {
    const genreMetadata = await generateGenreMetadata({
      params: Promise.resolve({ slug: "vr" }),
    });
    const actressParams = await generateActressStaticParams();
    const makerParams = await generateMakerStaticParams();
    const seriesParams = await generateSeriesStaticParams();
    const actressMetadata = await generateActressMetadata({
      params: Promise.resolve({ slug: actressParams[0].slug }),
    });
    const makerMetadata = await generateMakerMetadata({
      params: Promise.resolve({ slug: makerParams[0].slug }),
    });
    const seriesMetadata = await generateSeriesMetadata({
      params: Promise.resolve({ slug: seriesParams[0].slug }),
    });

    expect(genreMetadata.alternates?.canonical).toBe(getGenreRoute("vr"));
    expect(String(genreMetadata.title)).toContain("VR");
    expect(genreMetadata.description).toContain("VR");
    expect(genreMetadata.twitter?.card).toBe("summary_large_image");

    expect(String(actressMetadata.title)).toContain("作品");
    expect(String(actressMetadata.title)).toContain(decodeActressSlug(actressParams[0].slug));
    expect(actressMetadata.twitter?.card).toBe("summary_large_image");

    expect(makerMetadata.alternates?.canonical).toBe(
      getMakerRoute(decodeEntitySlug(makerParams[0].slug))
    );
    expect(String(makerMetadata.title)).toContain(decodeEntitySlug(makerParams[0].slug));
    expect(makerMetadata.twitter?.card).toBe("summary_large_image");

    expect(seriesMetadata.alternates?.canonical).toBe(
      getSeriesRoute(decodeEntitySlug(seriesParams[0].slug))
    );
    expect(String(seriesMetadata.title)).toContain(decodeEntitySlug(seriesParams[0].slug));
    expect(seriesMetadata.twitter?.card).toBe("summary_large_image");
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
    expect(searchRouteMetadata.description).toContain("価格帯");
    expect(searchRouteMetadata.description).toContain("検索");
    expect(searchRouteMetadata.alternates?.canonical).toBe(ROUTES.search);
  });

  it("renders a static genre page with intro copy and product cards", async () => {
    const page = await GenrePage({
      params: Promise.resolve({ slug: "vr" }),
    });

    render(page);

    expect(screen.getByRole("heading", { level: 1, name: /^VR$/ })).toBeInTheDocument();
    expect(screen.getAllByText(/視聴環境を整えてから選ぶと満足度が上がりやすい/i).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /FANZAで見る|FANZAで詳細を見る/i }).length).toBeGreaterThan(0);
  });

  it("renders a monthly ranking page with product cards and related discovery links", async () => {
    const { container } = render(await RankingPage());

    expect(screen.getByRole("heading", { name: /FANZA人気ランキング/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "人気女優ランキング" })).toBeInTheDocument();
    expect(screen.getByText(/女優・メーカー・レーベルで絞る/i)).toBeInTheDocument();
    expect(screen.queryByText(/準備中/i)).toBeNull();
    expect(container.querySelector(`a[href="${getGenreRoute("popular")}"]`)).not.toBeNull();
    expect(screen.getAllByRole("link", { name: /FANZAで見る|FANZAで詳細を見る/i }).length).toBeGreaterThan(0);
  });

  it("renders a static actress page with product cards and ranking links", async () => {
    const actressParams = await generateActressStaticParams();
    const page = await ActressPage({
      params: Promise.resolve({ slug: actressParams[0].slug }),
    });

    const { container } = render(page);
    const actressName = decodeActressSlug(actressParams[0].slug);

    expect(screen.getAllByRole("heading", { name: actressName }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /代表作を見る|FANZAで見る|FANZAで詳細を見る/i }).length).toBeGreaterThan(0);
    expect(container.querySelector(`a[href="${ROUTES.ranking}"]`)).not.toBeNull();
    expect(container.querySelector(`a[href="${ROUTES.sale}"]`)).not.toBeNull();
  });

  it("renders static maker and series pages with discovery links", async () => {
    const [makerParams, seriesParams] = await Promise.all([
      generateMakerStaticParams(),
      generateSeriesStaticParams(),
    ]);
    const makerName = decodeEntitySlug(makerParams[0].slug);
    const seriesName = decodeEntitySlug(seriesParams[0].slug);

    const makerView = render(
      await MakerPage({
        params: Promise.resolve({ slug: makerParams[0].slug }),
      })
    );

    expect(screen.getAllByRole("heading", { name: makerName }).length).toBeGreaterThan(0);
    expect(makerView.container.querySelector(`a[href="${ROUTES.ranking}"]`)).not.toBeNull();
    expect(makerView.container.querySelector(`a[href="${ROUTES.sale}"]`)).not.toBeNull();
    makerView.unmount();

    const seriesView = render(
      await SeriesPage({
        params: Promise.resolve({ slug: seriesParams[0].slug }),
      })
    );

    expect(screen.getAllByRole("heading", { name: seriesName }).length).toBeGreaterThan(0);
    expect(seriesView.container.querySelector(`a[href="${ROUTES.ranking}"]`)).not.toBeNull();
    expect(seriesView.container.querySelector(`a[href="${ROUTES.sale}"]`)).not.toBeNull();
  });

  it("renders a real sale page with monetized product cards", async () => {
    const { container } = render(await SalePage());

    expect(screen.getByRole("heading", { name: /現在開催中のセール情報/i })).toBeInTheDocument();
    expect(screen.queryByText(/API連携/i)).toBeNull();
    expect(container.querySelector(`a[href="${getGenreRoute("sale")}"]`)).not.toBeNull();
    expect(screen.getAllByRole("link", { name: /FANZAで見る|FANZAで詳細を見る/i }).length).toBeGreaterThan(0);
  });

  it("renders a new releases page with product cards and genre paths", async () => {
    const { container } = render(await NewReleasesPage());

    expect(screen.getByRole("heading", { name: /新着リリース/i })).toBeInTheDocument();
    expect(screen.getByText(/配信直後の作品を、反応の早さと件数で追いやすく並べています/i)).toBeInTheDocument();
    expect(container.querySelector(`a[href="${getGenreRoute("new-release")}"]`)).not.toBeNull();
    expect(container.querySelector(`a[href="${getGenreRoute("vr")}"]`)).not.toBeNull();
    expect(screen.getAllByRole("link", { name: /FANZAで見る|FANZAで詳細を見る/i }).length).toBeGreaterThan(0);
  });

  it("renders a static search-entry page with curated routes and monetized products", async () => {
    const element = await (SearchRoutePage as () => Promise<React.JSX.Element>)();
    const { container } = render(element);

    expect(screen.getByRole("heading", { name: /気になる作品を見つけよう/i })).toBeInTheDocument();
    expect(screen.getAllByText(/FANZA全体から検索|高速モード/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/準備中/i)).toBeNull();
    expect(container.querySelector(`input[placeholder*="検索"]`)).not.toBeNull();
    expect(container.querySelector(`button`)).not.toBeNull();
  });

  it("renders the articles discovery page with genre links", () => {
    const { container } = render(React.createElement(ArticlesPage));

    expect(container.querySelector(`a[href="${getGenreRoute("vr")}"]`)).not.toBeNull();
  });
});
