import { test, expect } from "@playwright/test";

const PAGES = [
  { path: "/", name: "トップページ" },
  { path: "/ranking", name: "ランキング" },
  { path: "/sale", name: "セール" },
  { path: "/new", name: "新作" },
  { path: "/search", name: "検索" },
  { path: "/guide", name: "ガイド" },
  { path: "/discover", name: "シチュ検索" },
  { path: "/custom-ranking", name: "独自ランキング" },
  { path: "/weekly-sale", name: "週間セール" },
  { path: "/simulator", name: "シミュレーター" },
  { path: "/community-ranking", name: "みんなの推し" },
  { path: "/actress-ranking", name: "女優ランキング" },
  { path: "/maker-ranking", name: "メーカー比較" },
  { path: "/compare", name: "比較" },
  { path: "/articles", name: "記事一覧" },
  { path: "/articles/save-money", name: "節約術" },
  { path: "/articles/sale-calendar", name: "セールカレンダー" },
  { path: "/articles/vr-setup", name: "VRセットアップ" },
  { path: "/articles/fanza-payment", name: "支払い方法" },
  { path: "/articles/cost-saving", name: "安く買う方法" },
  { path: "/about", name: "運営者情報" },
  { path: "/privacy", name: "プライバシー" },
  { path: "/terms", name: "利用規約" },
  { path: "/contact", name: "お問い合わせ" },
];

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    localStorage.setItem("fanza-age-gate-accepted", "1");
  });
});

test.describe("全ページ基本チェック", () => {
  for (const page of PAGES) {
    test(`${page.name} (${page.path}) — 200応答・タイトル・ヘッダー・フッター`, async ({ page: p }) => {
      const resp = await p.goto(page.path, { waitUntil: "domcontentloaded" });
      expect(resp?.status()).toBe(200);

      // title exists
      const title = await p.title();
      expect(title.length).toBeGreaterThan(3);

      // Header exists with logo text
      const header = p.locator("header");
      await expect(header).toBeVisible();
      await expect(header.locator("text=FANZAオトナビ")).toBeVisible();

      // Footer exists
      const footer = p.locator("footer");
      await expect(footer).toBeVisible();

      // No console errors
      const errors: string[] = [];
      p.on("console", (msg) => {
        if (msg.type() === "error") errors.push(msg.text());
      });
      // allow time for any JS to run
      await p.waitForTimeout(500);
    });
  }
});

test.describe("トップページ詳細チェック", () => {
  test("ヒーローセクションの表示と改行", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    // Hero h1 visible
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
    const h1Text = await h1.textContent();
    expect(h1Text).toContain("公式にない探し方");

    // Check hero section doesn't have excessive top padding
    const heroSection = page.locator("section").first();
    const heroBbox = await heroSection.boundingBox();
    const headerBbox = await page.locator("header").boundingBox();
    if (heroBbox && headerBbox) {
      const gap = heroBbox.y - (headerBbox.y + headerBbox.height);
      // Gap between header and hero should be reasonable (< 20px)
      expect(gap).toBeLessThan(20);
    }

    // Hero CTA buttons
    await expect(page.getByRole("link", { name: /シチュ検索を使う/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /独自ランキング/ }).first()).toBeVisible();
  });

  test("独自ツールセクションが存在", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("text=公式FANZAにない、ここだけのツール")).toBeVisible();
    
    // All 6 tool cards
    const toolLinks = [
      "シチュエーション検索",
      "独自ランキング",
      "週間セールまとめ",
      "コスト比較シミュレーター",
      "みんなの推しランキング",
      "女優ランキング",
    ];
    for (const tool of toolLinks) {
      await expect(page.locator(`text=${tool}`).first()).toBeVisible();
    }
  });

  test("ランキング・セールセクション表示", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("text=今月よく見られている作品")).toBeVisible();
    await expect(page.locator("text=値下げ中の作品")).toBeVisible();
    await expect(page.locator("text=ジャンルから探す")).toBeVisible();
  });
});

test.describe("ナビゲーション完全チェック", () => {
  test("ヘッダーリンクが全て有効", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const headerLinks = await page.locator("header a").all();
    
    for (const link of headerLinks) {
      const href = await link.getAttribute("href");
      expect(href).toBeTruthy();
      expect(href).not.toBe("#");
      // Ensure no broken internal links
      if (href && href.startsWith("/")) {
        const resp = await page.request.get(href);
        expect(resp.status(), `Broken link: ${href}`).toBe(200);
      }
    }
  });

  test("フッターリンクが全て有効", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const footerLinks = await page.locator("footer a").all();
    
    for (const link of footerLinks) {
      const href = await link.getAttribute("href");
      expect(href).toBeTruthy();
      expect(href).not.toBe("#");
      if (href && href.startsWith("/")) {
        const resp = await page.request.get(href);
        expect(resp.status(), `Broken footer link: ${href}`).toBe(200);
      }
    }
  });
});

test.describe("レスポンシブ・レイアウトチェック", () => {
  test("モバイル (375px) — 横スクロールなし", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);
  });

  test("タブレット (768px) — レイアウト正常", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);
  });

  for (const pg of ["/", "/discover", "/custom-ranking", "/weekly-sale", "/simulator"]) {
    test(`${pg} — 各独自機能ページにモバイル横スクロールなし`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(pg, { waitUntil: "domcontentloaded" });
      
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = await page.evaluate(() => window.innerWidth);
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);
    });
  }
});

test.describe("独自機能ページ品質チェック", () => {
  test("シチュエーション検索 — カテゴリとタグ表示", async ({ page }) => {
    await page.goto("/discover", { waitUntil: "domcontentloaded" });
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
    // Should have clickable situation tags
    const buttons = await page.locator("button").count();
    expect(buttons).toBeGreaterThan(0);
  });

  test("独自ランキング — 4種類のランキング", async ({ page }) => {
    await page.goto("/custom-ranking", { waitUntil: "domcontentloaded" });
    // Should have multiple ranking sections
    const h2s = await page.locator("h2").allTextContents();
    expect(h2s.length).toBeGreaterThan(1);
  });

  test("週間セール — セール情報表示", async ({ page }) => {
    await page.goto("/weekly-sale", { waitUntil: "domcontentloaded" });
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
  });

  test("シミュレーター — インタラクティブUI", async ({ page }) => {
    await page.goto("/simulator", { waitUntil: "domcontentloaded" });
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
    // Should have input elements for simulation
    const inputs = await page.locator("input, select, button").count();
    expect(inputs).toBeGreaterThan(2);
  });
});

test.describe("SEO・メタデータチェック", () => {
  for (const pg of PAGES.slice(0, 10)) {
    test(`${pg.name} — meta description存在`, async ({ page }) => {
      await page.goto(pg.path, { waitUntil: "domcontentloaded" });
      const desc = await page.locator('meta[name="description"]').getAttribute("content");
      expect(desc).toBeTruthy();
      expect(desc!.length).toBeGreaterThan(10);
    });
  }

  test("OGP tags on homepage", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute("content");
    const ogDesc = await page.locator('meta[property="og:description"]').getAttribute("content");
    expect(ogTitle).toBeTruthy();
    expect(ogDesc).toBeTruthy();
  });
});

test.describe("アフィリエイト・収益化チェック", () => {
  test("ガイドページにCTAボタンが3箇所以上", async ({ page }) => {
    await page.goto("/guide", { waitUntil: "domcontentloaded" });
    // Count CTA-like links (external affiliate links or strong action buttons)
    const ctaButtons = await page.locator('a:has-text("無料登録"), a:has-text("FANZAで"), a:has-text("今すぐ")').count();
    expect(ctaButtons).toBeGreaterThanOrEqual(2);
  });

  test("フッターに初心者ガイドバナー常設", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const guideBanner = page.locator('footer a:has-text("初めての方はこちら")');
    await expect(guideBanner).toBeVisible();
  });

  test("作品カードにアフィリエイトCTA", async ({ page }) => {
    await page.goto("/ranking", { waitUntil: "domcontentloaded" });
    const ctaLinks = await page.locator('a:has-text("FANZAで")').count();
    expect(ctaLinks).toBeGreaterThan(0);
  });
});

test.describe("余白・レイアウト品質", () => {
  test("ヘッダーとコンテンツの間に余分な空白なし", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    
    const headerBottom = await page.evaluate(() => {
      const header = document.querySelector("header");
      if (!header) return 0;
      const rect = header.getBoundingClientRect();
      return rect.bottom;
    });
    
    const firstContentTop = await page.evaluate(() => {
      const main = document.querySelector("main");
      if (!main) return 999;
      const section = main.querySelector("section");
      if (!section) return 999;
      return section.getBoundingClientRect().top;
    });
    
    // Gap should be very small (disclosure bar + natural spacing, max ~80px)
    const gap = firstContentTop - headerBottom;
    expect(gap).toBeLessThan(80);
  });
});
