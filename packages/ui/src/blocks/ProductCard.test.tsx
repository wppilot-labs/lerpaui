import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductCard } from "./ProductCard";

const sample = {
  id: "p1",
  title: "My Product",
  price: 49.99,
  category: "Books",
  rating: 4.8,
  reviewsCount: 12,
  badge: "New",
  description: "Product description here.",
};

describe("ProductCard", () => {
  it("renders product title and price", () => {
    render(<ProductCard product={sample} />);
    expect(screen.getByText("My Product")).toBeInTheDocument();
    expect(screen.getByText(/49\.99/)).toBeInTheDocument();
  });

  it("renders badge if provided", () => {
    render(<ProductCard product={sample} />);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("calls onAddToCart when add button clicked", async () => {
    const user = userEvent.setup();
    let added = false;
    render(<ProductCard product={sample} onAddToCart={() => (added = true)} />);
    const cartBtn = screen.getByRole("button", { name: /add my product to cart/i });
    await user.click(cartBtn);
    expect(added).toBe(true);
  });

  it("calls onFavoriteClick when favorite button clicked", async () => {
    const user = userEvent.setup();
    let faved = false;
    render(<ProductCard product={sample} onFavoriteClick={() => (faved = true)} />);
    const heartBtn = screen.getByRole("button", { name: /add my product to favorites/i });
    await user.click(heartBtn);
    expect(faved).toBe(true);
  });
});
