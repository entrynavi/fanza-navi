import { test, expect } from "@playwright/test";

test.describe("レスポンシブデザイン", () => {
  test("モバイル: ハンバーガーメニューが表示される", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const menuButton = page.getByRole("button", { name: "メニューを開く" });
    await expect(menuButton).toBeVisible();
  });

  test("モバイル: メニュー開閉が動作する", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const menuButton = page.getByRole("button", { name: "メニューを開く" });
    await menuButton.click();

    const mobileNav = page.locator("#mobile-navigation");
    await expect(mobileNav).toBeVisible();
    await expect(mobileNav.getByText("ランキング")).toBeVisible();
    await expect(mobileNav.getByText("セール")).toBeVisible();
  });

  test("デスクトップ: ナビゲーションリンクが直接表示される", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const nav = page.locator("header nav");
    await expect(nav.getByText("ランキング")).toBeVisible();
    await expect(nav.getByText("セール")).toBeVisible();
  });

  test("デスクトップ: ハンバーガーメニューが非表示", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const menuButton = page.getByRole("button", { name: "メニューを開く" });
    await expect(menuButton).not.toBeVisible();
  });

  test("タブレット: コンテンツが正しくレイアウトされる", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("人気作から探す。")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
  });
});

test.describe("日本語テキスト品質", () => {
  test("英語のeyebrowラベルがホームページに残っていないこと", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const body = await page.locator("body").textContent();

    const forbiddenLabels = [
      "Start Here",
      "Weekly Focus",
      "Monthly Ranking",
      "Sale Highlights",
      "Genre Navigation",
      "Editorial Notes",
      "Related Routes",
    ];

    for (const label of forbiddenLabels) {
      expect(body, `"${label}" should not appear on homepage`).not.toContain(label);
    }
  });

  test("「補助メモ」がホームページに残っていないこと", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const body = await page.locator("body").textContent();
    expect(body).not.toContain("補助メモ");
  });

  test("価格表示に¥記号が使われている", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const priceElements = page.locator("text=/¥[\\d,]+/");
    const count = await priceElements.count();
    expect(count).toBeGreaterThan(0);
  });
});
