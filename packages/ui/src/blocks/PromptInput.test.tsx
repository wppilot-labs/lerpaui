import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PromptInput } from "./PromptInput";

describe("PromptInput", () => {
  it("renders a textarea", () => {
    render(<PromptInput />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("calls onSubmit when Enter is pressed without Shift", async () => {
    const user = userEvent.setup();
    let submitted = "";
    render(<PromptInput onSubmit={(p) => (submitted = p)} />);
    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "Hello world{Enter}");
    expect(submitted).toBe("Hello world");
  });

  it("does not submit when Shift+Enter is pressed", async () => {
    const user = userEvent.setup();
    let submitted = "";
    render(<PromptInput onSubmit={(p) => (submitted = p)} />);
    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "Line 1");
    await user.keyboard("{Shift>}{Enter}{/Shift}");
    expect(submitted).toBe("");
  });

  it("truncates input to maxLength when typed", async () => {
    const user = userEvent.setup();
    render(<PromptInput maxLength={5} />);
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    await user.type(textarea, "abcdefghij");
    expect(textarea.value.length).toBe(5);
  });
});
