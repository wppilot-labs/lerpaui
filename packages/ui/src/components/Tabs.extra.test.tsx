import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./Tabs";

describe("Tabs keyboard navigation", () => {
  it("moves to next tab with ArrowRight key", async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">A</TabsTrigger>
          <TabsTrigger value="b">B</TabsTrigger>
          <TabsTrigger value="c">C</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Panel A</TabsContent>
        <TabsContent value="b">Panel B</TabsContent>
        <TabsContent value="c">Panel C</TabsContent>
      </Tabs>
    );
    screen.getByRole("tab", { name: /a/i }).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: /b/i, selected: true })).toBeInTheDocument();
  });

  it("moves to previous tab with ArrowLeft key", async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="b">
        <TabsList>
          <TabsTrigger value="a">A</TabsTrigger>
          <TabsTrigger value="b">B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Panel A</TabsContent>
        <TabsContent value="b">Panel B</TabsContent>
      </Tabs>
    );
    screen.getByRole("tab", { name: /b/i }).focus();
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("tab", { name: /a/i, selected: true })).toBeInTheDocument();
  });

  it("supports controlled value", async () => {
    const user = userEvent.setup();
    let current = "a";
    function Component() {
      const [val, setVal] = React.useState("a");
      return (
        <Tabs
          value={val}
          onValueChange={(v) => {
            setVal(v);
            current = v;
          }}
        >
          <TabsList>
            <TabsTrigger value="a">A</TabsTrigger>
            <TabsTrigger value="b">B</TabsTrigger>
          </TabsList>
          <TabsContent value="a">Panel A</TabsContent>
          <TabsContent value="b">Panel B</TabsContent>
        </Tabs>
      );
    }
    render(<Component />);
    await user.click(screen.getByRole("tab", { name: /b/i }));
    expect(current).toBe("b");
  });
});
