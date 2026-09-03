import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "./page";

describe("app shell", () => {
  it("states the Grindboard promise", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: /the work\s*leaves a mark/i }),
    ).toBeDefined();
    expect(screen.getByText("Applications")).toBeDefined();
    expect(screen.getByText("LeetCode solves")).toBeDefined();
    expect(screen.getByText("Counted commits")).toBeDefined();
  });
});
