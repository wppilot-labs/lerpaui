"use client";

import React, { useState } from "react";

export function CheckoutPaymentMethodCard() {
  const [activeTab, setActiveTab] = useState("card");

  return (
    <div className="w-full max-w-sm bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl select-none font-sans text-foreground">
      <div className="flex gap-1 bg-secondary/20 p-0.5 rounded-lg mb-4">
        {["card", "paypal"].map((tab) => (
          <button
            key={tab}
            type="button"
            aria-pressed={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1 rounded-md text-[10px] uppercase font-bold transition-all ${
              activeTab === tab ? "bg-card text-foreground shadow-sm" : "text-muted-foreground/60 hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "card" ? (
        <div className="space-y-3">
          <label htmlFor="cpmc-name" className="sr-only">Cardholder name</label>
          <input
            id="cpmc-name"
            type="text"
            autoComplete="cc-name"
            placeholder="Cardholder Name"
            className="w-full px-3 py-1.5 bg-secondary/30 border border-white/[0.04] rounded-xl text-xs focus:outline-none focus:border-violet-500/50"
          />
          <label htmlFor="cpmc-number" className="sr-only">Card number</label>
          <input
            id="cpmc-number"
            type="text"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="Card Number"
            className="w-full px-3 py-1.5 bg-secondary/30 border border-white/[0.04] rounded-xl text-xs focus:outline-none focus:border-violet-500/50"
          />
        </div>
      ) : (
        <div className="py-4 text-center text-xs text-muted-foreground/60">
          Redirecting securely to secure PayPal endpoints...
        </div>
      )}
    </div>
  );
}