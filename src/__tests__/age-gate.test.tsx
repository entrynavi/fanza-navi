import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import AgeGate from "@/components/AgeGate";

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

    render(<AgeGate />);

    await waitFor(() => {
      expect(screen.queryByText("18歳以上ですか？")).not.toBeInTheDocument();
      expect(document.body.style.overflow).toBe("");
    });
  });
});
