"use client";

import React from "react";
import { useTonStore } from "@/lib/ton-store";
import Ticker from "@/components/ton/Ticker";
import UtilityNav from "@/components/ton/UtilityNav";
import Masthead from "@/components/ton/Masthead";
import Navigation from "@/components/ton/Navigation";
import HomeView from "@/components/ton/HomeView";
import JobScraperView from "@/components/ton/JobScraperView";
import TenderAnalysisView from "@/components/ton/TenderAnalysisView";
import ContributorDashboard from "@/components/ton/ContributorDashboard";
import BrandSystemView from "@/components/ton/BrandSystemView";
import Footer from "@/components/ton/Footer";
import { motion, AnimatePresence } from "framer-motion";

const viewVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

function CurrentView({ view }: { view: string }) {
  switch (view) {
    case "home":
      return <HomeView />;
    case "jobs":
      return <JobScraperView />;
    case "tender":
      return <TenderAnalysisView />;
    case "contributor":
      return <ContributorDashboard />;
    case "brand":
      return <BrandSystemView />;
    default:
      return <HomeView />;
  }
}

export default function TonPortal() {
  const { currentView } = useTonStore();

  return (
    <div className="min-h-screen flex flex-col bg-ton-cream">
      <Ticker />
      <UtilityNav />
      <Masthead />
      <Navigation />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            variants={viewVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <CurrentView view={currentView} />
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
