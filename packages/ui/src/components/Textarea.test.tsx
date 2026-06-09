import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Textarea } from "./Textarea";

describe("Textarea", () => {
  it("renders a textarea", () => {
    render(<Textarea aria-label="comment" />);
    expect(screen.getByLabelText("comment")).toBeInTheDocument();
  });

  it("accepts user typing", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Textarea aria-label="comment" onChange={onChange} />);
    const ta = screen.getByLabelText("comment") as HTMLTextAreaElement;
    await user.type(ta, "abc");
    expect(ta.value).toBe("abc");
    expect(onChange).toHaveBeenCalled();
  });

  it("renders an error alert when error is a string", () => {
    render(<Textarea id="bio" aria-label="bio" error="Required" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Required");
  });

  it("becomes aria-invalid when error is set", () => {
    render(<Textarea aria-label="bio" error />);
    expect(screen.getByLabelText("bio")).toHaveAttribute("aria-invalid", "true");
  });
});
