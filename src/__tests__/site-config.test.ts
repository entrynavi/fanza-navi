import { describe, expect, it } from "vitest";
import { ROUTES, SITE_URL } from "@/lib/site";

describe("site config", () => {
  it("uses a valid site URL", () => {
    expect(new URL(SITE_URL).pathname).toBe("/");
  });

  it("uses root-relative routes without a GitHub Pages base path", () => {
    expect(ROUTES.home).toBe("/");
    expect(ROUTES.ranking).toBe("/ranking");
    expect(ROUTES.articles).toBe("/articles");
    expect(Object.values(ROUTES).every((route) => !route.includes("/fanza-navi"))).toBe(true);
  });
});
