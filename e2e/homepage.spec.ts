import { test, expect } from "@playwright/test";

test.describe("ホームページ", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("ページタイトルにFANZAナビが含まれる", async ({ page }) => {
    await expect(page).toHaveTitle(/FANZAナビ|FANZA/);
  });

  test("ヘッダーのブランド名が表示される", async ({ page }) => {
    const brand = page.locator("header").getByText("FANZAナビ");
    await expect(brand.first()).toBeVisible();
  });

  test("ヘッダーのナビリンクが存在する", async ({ page }) => {
    const header = page.locator("header");
    for (const label of ["ランキング", "セール", "ジャンル別", "レビュー"]) {
      await expect(header.getByText(label).first()).toBeVisible();
    }
  });

  test("ヒーローセクションが表示される", async ({ page }) => {
    await expect(page.getByText("人気作から探す。")).toBeVisible();
    await expect(page.getByText("安い日はセールへ。")).toBeVisible();
  });

  test("ランキングセクションが表示される", async ({ page }) => {
    await expect(page.getByText("今月よく見られている作品")).toBeVisible();
  });

  test("セールセクションが表示される", async ({ page }) => {
    await expect(page.getByText("値下げ中の作品").first()).toBeVisible();
  });

  test("ジャンルセクションが表示される", async ({ page }) => {
    await expect(page.getByText("ジャンルから探す")).toBeVisible();
  });

  test("レビューセクションが表示される", async ({ page }) => {
    await expect(page.getByText("作品レビュー").first()).toBeVisible();
  });

  test("フッターが表示される", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    await expect(footer.getByText("免責事項").first()).toBeVisible();
    await expect(footer.getByRole("link", { name: "プライバシーポリシー" })).toBeVisible();
  });

  test("フッターの著作権表記が正しい", async ({ page }) => {
    const year = new Date().getFullYear().toString();
    await expect(page.locator("footer").getByText(year).first()).toBeVisible();
  });

  test("PR表記バーが表示される", async ({ page }) => {
    await expect(page.getByText("アフィリエイト広告").first()).toBeVisible();
  });
});
