import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./Accordion";

describe("Accordion multiple/single modes", () => {
  it("opens multiple items in type=multiple mode", async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="multiple">
        <AccordionItem value="a">
          <AccordionTrigger>Q1</AccordionTrigger>
          <AccordionContent>A1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>Q2</AccordionTrigger>
          <AccordionContent>A2</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    await user.click(screen.getByRole("button", { name: /q1/i }));
    await user.click(screen.getByRole("button", { name: /q2/i }));
    expect(screen.getByRole("button", { name: /q1/i })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: /q2/i })).toHaveAttribute("aria-expanded", "true");
  });

  it("closes previously open item in type=single mode", async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="a">
          <AccordionTrigger>Q1</AccordionTrigger>
          <AccordionContent>A1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>Q2</AccordionTrigger>
          <AccordionContent>A2</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    await user.click(screen.getByRole("button", { name: /q1/i }));
    expect(screen.getByRole("button", { name: /q1/i })).toHaveAttribute("aria-expanded", "true");
    await user.click(screen.getByRole("button", { name: /q2/i }));
    expect(screen.getByRole("button", { name: /q1/i })).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("button", { name: /q2/i })).toHaveAttribute("aria-expanded", "true");
  });

  it("supports collapsing back via click in collapsible single mode", async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single" collapsible defaultValue="a">
        <AccordionItem value="a">
          <AccordionTrigger>Q1</AccordionTrigger>
          <AccordionContent>A1</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    expect(screen.getByRole("button", { name: /q1/i })).toHaveAttribute("aria-expanded", "true");
    await user.click(screen.getByRole("button", { name: /q1/i }));
    expect(screen.getByRole("button", { name: /q1/i })).toHaveAttribute("aria-expanded", "false");
  });
});
