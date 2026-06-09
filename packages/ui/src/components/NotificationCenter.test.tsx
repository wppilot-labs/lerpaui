import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NotificationCenter } from "./NotificationCenter";

describe("NotificationCenter", () => {
  it("renders bell trigger with unread count", () => {
    render(<NotificationCenter />);
    expect(screen.getByRole("button", { name: /3 unread/i })).toBeInTheDocument();
  });

  it("opens panel when bell is clicked", async () => {
    const user = userEvent.setup();
    render(<NotificationCenter />);
    await user.click(screen.getByRole("button", { name: /notifications/i }));
    expect(screen.getByRole("dialog", { name: /notifications/i })).toBeInTheDocument();
  });

  it("shows demo notifications when opened", async () => {
    const user = userEvent.setup();
    render(<NotificationCenter />);
    await user.click(screen.getByRole("button", { name: /notifications/i }));
    expect(screen.getByText(/New deployment failed/i)).toBeInTheDocument();
  });

  it("marks all as read when button clicked", async () => {
    const user = userEvent.setup();
    let allRead = false;
    render(<NotificationCenter onMarkAllRead={() => (allRead = true)} />);
    await user.click(screen.getByRole("button", { name: /notifications/i }));
    await user.click(screen.getByRole("button", { name: /mark all read/i }));
    expect(allRead).toBe(true);
  });

  it("respects empty items list", () => {
    render(<NotificationCenter items={[]} />);
    const trigger = screen.getByRole("button", { name: /notifications$/i });
    expect(trigger).toBeInTheDocument();
  });
});
