import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SocialProof from "@/components/SocialProof";

describe("SocialProof Component", () => {
  it("renders honest feature descriptions", () => {
    render(<SocialProof />);

    expect(screen.getByText("月間ランキング")).toBeInTheDocument();
    expect(screen.getByText("セール比較")).toBeInTheDocument();
    expect(screen.getByText("ジャンル回遊")).toBeInTheDocument();
  });

  it("does NOT contain fake viewer counts", () => {
    render(<SocialProof />);

    expect(screen.queryByText(/人が閲覧中/)).not.toBeInTheDocument();
    expect(screen.queryByText(/件購入/)).not.toBeInTheDocument();
    expect(screen.queryByText(/人が利用/)).not.toBeInTheDocument();
  });
});
