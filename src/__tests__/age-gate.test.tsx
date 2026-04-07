import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { renderToString } from "react-dom/server";
import AgeGate from "@/components/AgeGate";
import RootLayout from "@/app/layout";

const createStorage = () => {
  const store = new Map<string, string>();

  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
  };
};

describe("AgeGate", () => {
  afterEach(() => {
    cleanup();
    delete document.documentElement.dataset.ageGateAccepted;
    document.body.innerHTML = "";
  });

  beforeEach(() => {
    const storage = createStorage();
    Object.defineProperty(window, "localStorage", {
      value: storage,
      configurable: true,
    });
    document.body.style.overflow = "";
  });

  it("blocks content, locks scroll, and offers an exit link on first visit", () => {
    render(<AgeGate />);

    expect(screen.getByText("18歳以上ですか？")).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");

    const exitLink = screen.getByRole("link", { name: "18歳未満の方はこちら" });
    expect(exitLink).toHaveAttribute("href", "https://www.google.com/");
  });

  it("renders visible server HTML for first-time visitors", () => {
    const html = renderToString(<AgeGate />);

    expect(html).toContain("18歳以上ですか？");
    expect(html).not.toContain('style="opacity:0"');
    expect(html).not.toContain('style="transform:translateY(24px) scale(0.96)"');
  });

  it("renders the app shell inert in static layout HTML", () => {
    const html = renderToString(
      <RootLayout>
        <main>Layout child</main>
      </RootLayout>
    );

    expect(html).toContain('id="app-shell" inert="" aria-hidden="true"');
    expect(html.split('removeAttribute("inert")')).toHaveLength(2);
    expect(html.split('removeAttribute("aria-hidden")')).toHaveLength(2);
  });

  it("skips the gate immediately when the accepted marker is present before render", () => {
    document.documentElement.dataset.ageGateAccepted = "1";

    render(<AgeGate />);

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.body.style.overflow).toBe("");
  });

  it("marks the app shell inert and aria-hidden while the gate is open", async () => {
    document.body.innerHTML = '<div id="app-shell"><a href="/">Home</a></div>';

    render(<AgeGate />);

    const appShell = document.getElementById("app-shell");
    expect(appShell).toHaveAttribute("inert");
    expect(appShell).toHaveAttribute("aria-hidden", "true");

    fireEvent.click(screen.getByRole("button", { name: "18歳以上です" }));

    await waitFor(() => {
      expect(appShell).not.toHaveAttribute("inert");
      expect(appShell).not.toHaveAttribute("aria-hidden");
    });
  });

  it("moves focus into the dialog when the gate opens", async () => {
    render(<AgeGate />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "18歳以上です" })).toHaveFocus();
    });
  });

  it("stores acceptance and unlocks scroll when the user confirms they are 18+", async () => {
    render(<AgeGate />);

    fireEvent.click(screen.getByRole("button", { name: "18歳以上です" }));

    await waitFor(() => {
      expect(window.localStorage.getItem("fanza-age-gate-accepted")).toBe("1");
      expect(screen.queryByText("18歳以上ですか？")).not.toBeInTheDocument();
      expect(document.body.style.overflow).toBe("");
    });
  });

  it("skips the gate after acceptance is already stored", async () => {
    window.localStorage.setItem("fanza-age-gate-accepted", "1");
    document.documentElement.dataset.ageGateAccepted = "1";

    render(<AgeGate />);

    await waitFor(() => {
      expect(screen.queryByText("18歳以上ですか？")).not.toBeInTheDocument();
      expect(document.body.style.overflow).toBe("");
    });
  });
});
