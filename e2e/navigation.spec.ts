import { test, expect } from "@playwright/test";

test.describe("ナビゲーション", () => {
  test("ヘッダーからランキングページに遷移できる", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.locator("header a[href='/ranking']").first().click();
    await expect(page).toHaveURL(/\/ranking/);
  });

  test("ヘッダーからセールページに遷移できる", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.locator("header a[href='/sale']").first().click();
    await expect(page).toHaveURL(/\/sale/);
  });

  test("ヘッダーからレビューページに遷移できる", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.locator("header a[href='/reviews']").first().click();
    await expect(page).toHaveURL(/\/reviews/);
  });

  test("フッターからプライバシーポリシーに遷移できる", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.locator("footer a[href='/privacy']").click();
    await expect(page).toHaveURL(/\/privacy/);
  });

  test("フッターからガイドページに遷移できる", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.locator("footer").getByRole("link", { name: "初心者ガイド" }).click();
    await expect(page).toHaveURL(/\/guide/);
  });

  test("ランキングページが正しく表示される", async ({ page }) => {
    await page.goto("/ranking");
    await expect(page).toHaveTitle(/ランキング|FANZA/);
  });

  test("セールページが正しく表示される", async ({ page }) => {
    await page.goto("/sale");
    await expect(page).toHaveTitle(/セール|FANZA/);
  });

  test("レビュー一覧ページが正しく表示される", async ({ page }) => {
    await page.goto("/reviews");
    await expect(page).toHaveTitle(/レビュー|FANZA/);
  });

  test("新作ページが正しく表示される", async ({ page }) => {
    await page.goto("/new");
    await expect(page).toHaveTitle(/新作|FANZA/);
  });

  test("検索ページが正しく表示される", async ({ page }) => {
    await page.goto("/search");
    await expect(page).toHaveTitle(/検索|FANZA/);
  });

  test("ガイドページが正しく表示される", async ({ page }) => {
    await page.goto("/guide");
    await expect(page).toHaveTitle(/ガイド|FANZA/);
  });
});
