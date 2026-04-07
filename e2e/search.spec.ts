import { test, expect } from "@playwright/test";

test.describe("検索ページ", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/search");
  });

  test("検索入力欄が表示される", async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute(
      "placeholder",
      /作品名|女優名|メーカー|タグ/
    );
  });

  test("フィルターボタンが表示される", async ({ page }) => {
    await expect(page.getByText("フィルター")).toBeVisible();
    await expect(page.getByText("セール中のみ")).toBeVisible();
  });

  test("作品カードが表示される", async ({ page }) => {
    const resultCount = page.locator("text=件の作品");
    await expect(resultCount).toBeVisible();
  });

  test("ジャンル一覧セクションが表示される", async ({ page }) => {
    await expect(page.getByText("ジャンル別に探す")).toBeVisible();
  });

  test("検索でフィルタリングされる", async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill("VR");
    const resultText = page.locator("text=の検索結果");
    await expect(resultText).toBeVisible();
  });

  test("フィルターパネルが開閉する", async ({ page }) => {
    // Price range button should be hidden initially
    await expect(page.getByText("〜¥1,000")).not.toBeVisible();
    // Click filter button to open panel
    await page.locator("button", { hasText: "フィルター" }).first().click();
    // Price range option should now be visible
    await expect(page.getByText("〜¥1,000")).toBeVisible({ timeout: 5000 });
  });

  test("ソートセレクトが存在する", async ({ page }) => {
    const select = page.locator("select");
    await expect(select).toBeVisible();
  });
});
