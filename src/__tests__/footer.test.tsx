import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Footer from "@/components/Footer";

describe("Footer Component", () => {
  it("renders disclaimer", () => {
    render(<Footer />);
    expect(
      screen.getByText(/アフィリエイトプログラムに参加/)
    ).toBeInTheDocument();
  });

  it("renders legal page links with correct hrefs", () => {
    const { container } = render(<Footer />);

    const links = Array.from(container.querySelectorAll("a"));
    const hrefs = links.map((a) => a.getAttribute("href"));

    expect(hrefs).toContain("/privacy");
    expect(hrefs).toContain("/terms");
    expect(hrefs).toContain("/about");
  });

  it("renders copyright", () => {
    const { container } = render(<Footer />);
    expect(container.textContent).toContain("FANZAナビ");
  });

  it("no links point to '#'", () => {
    const { container } = render(<Footer />);
    const links = container.querySelectorAll("a");
    links.forEach((link) => {
      expect(link.getAttribute("href")).not.toBe("#");
    });
  });
});
