import { test, expect, type Page } from "@playwright/test";
import { dismissAgeGate, prepareAgeGateBypass } from "./helpers";

async function visit(page: Page, path: string) {
  await prepareAgeGateBypass(page);
  await page.goto(path);
  await page.waitForLoadState("networkidle");
  await dismissAgeGate(page);
}

test.describe("ナビゲーション", () => {
  test("ヘッダーからランキングページに遷移できる", async ({ page }) => {
    await visit(page, "/");
    await page.locator("header a[href='/ranking']").first().click();
    await expect(page).toHaveURL(/\/ranking/);
  });

  test("ヘッダーからセールページに遷移できる", async ({ page }) => {
    await visit(page, "/");
    await page.locator("header a[href='/sale']").first().click();
    await expect(page).toHaveURL(/\/sale/);
  });

  test("ヘッダーからシチュ検索ページに遷移できる", async ({ page }) => {
    await visit(page, "/");
    await page.locator("header a[href='/discover']").first().click();
    await expect(page).toHaveURL(/\/discover/);
  });

  test("フッターからプライバシーポリシーに遷移できる", async ({ page }) => {
    await visit(page, "/");
    await page.locator("footer a[href='/privacy']").click();
    await expect(page).toHaveURL(/\/privacy/);
  });

  test("フッターからガイドページに遷移できる", async ({ page }) => {
    await visit(page, "/");
    await page.locator("footer").getByRole("link", { name: "初心者ガイド" }).click();
    await expect(page).toHaveURL(/\/guide/);
  });

  test("ランキングページが正しく表示される", async ({ page }) => {
    await visit(page, "/ranking");
    await expect(page).toHaveTitle(/ランキング|FANZA/);
  });

  test("セールページが正しく表示される", async ({ page }) => {
    await visit(page, "/sale");
    await expect(page).toHaveTitle(/セール|FANZA/);
  });

  test("独自ランキングページが正しく表示される", async ({ page }) => {
    await visit(page, "/custom-ranking");
    await expect(page).toHaveTitle(/ランキング|FANZA/);
  });

  test("新作ページが正しく表示される", async ({ page }) => {
    await visit(page, "/new");
    await expect(page).toHaveTitle(/新作|FANZA/);
  });

  test("検索ページが正しく表示される", async ({ page }) => {
    await visit(page, "/search");
    await expect(page).toHaveTitle(/検索|FANZA/);
  });

  test("ガイドページが正しく表示される", async ({ page }) => {
    await visit(page, "/guide");
    await expect(page).toHaveTitle(/ガイド|FANZA/);
  });
});
