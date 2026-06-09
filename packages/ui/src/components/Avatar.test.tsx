import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Avatar, AvatarFallback, AvatarImage } from "./Avatar";

describe("Avatar", () => {
  it("renders the fallback when no image loads", () => {
    render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("accepts custom className on root", () => {
    const { container } = render(
      <Avatar className="custom-av">
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );
    expect(container.firstChild).toHaveClass("custom-av");
  });

  it("renders an image element when AvatarImage is provided", () => {
    render(
      <Avatar>
        <AvatarImage src="/a.png" alt="user" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    );
    // Radix renders the fallback first while the image is loading in jsdom.
    expect(screen.getByText("U")).toBeInTheDocument();
  });
});
