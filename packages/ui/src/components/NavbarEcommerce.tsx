"use client";

import React, { useState } from "react";
import { Search, Heart, User, ShoppingBag } from "lucide-react";
import { cn } from "../lib/cn";

const CATEGORIES = ["New", "Women", "Men", "Accessories", "Sale"];

export interface NavbarEcommerceProps {
  className?: string;
}

export function NavbarEcommerce({ className }: NavbarEcommerceProps) {
  const [active, setActive] = useState("New");

  return (
    <header
      className={cn(
        "w-full max-w-3xl bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-3 px-5 py-3.5">
        <a
          href="/"
          className="shrink-0 text-lg font-black uppercase tracking-[0.2em]"
        >
          Maison
        </a>

        <nav aria-label="Shop categories" className="hidden flex-1 md:block">
          <ul className="flex items-center justify-center gap-1">
            {CATEGORIES.map((c) => {
              const isActive = active === c;
              const isSale = c === "Sale";
              return (
                <li key={c}>
                  <button
                    type="button"
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setActive(c)}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-sm font-semibold uppercase tracking-wide transition-colors",
                      isSale && "text-rose-400 hover:text-rose-300",
                      !isSale &&
                        (isActive
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"),
                    )}
                  >
                    {c}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <div className="relative hidden lg:block">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40" />
            <label htmlFor="shop-search" className="sr-only">
              Search products
            </label>
            <input
              id="shop-search"
              placeholder="Search…"
              className="w-36 rounded-full border border-border/60 bg-secondary/30 py-1.5 pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>
          <button
            type="button"
            aria-label="Search"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground lg:hidden"
          >
            <Search className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Wishlist"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
          >
            <Heart className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Account"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
          >
            <User className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Cart, 3 items"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
              3
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
