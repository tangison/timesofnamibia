"use client";

import Ticker from "./Ticker";
import UtilityNav from "./UtilityNav";
import Masthead from "./Masthead";
import Navigation from "./Navigation";
import Footer from "./Footer";

export default function TonLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-ton-cream">
      <Ticker />
      <UtilityNav />
      <Masthead />
      <Navigation />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
