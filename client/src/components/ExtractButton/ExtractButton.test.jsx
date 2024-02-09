import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import ExtractButton from "./ExtractButton.jsx";

describe("<ExtractButton />", () => {
  it("Rendering button component", () => {
    render(<ExtractButton />);
  });
});
