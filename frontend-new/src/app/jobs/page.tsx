import { Metadata } from "next";
import TonLayout from "@/components/ton/TonLayout";
import JobScraperView from "@/components/ton/JobScraperView";

export const metadata: Metadata = {
  title: "Job Scraper — Namibia Employment Intelligence",
  description:
    "Real-time job listings scraped from NIEIS, LinkedIn, and Namibian employment portals. Salary ranges, regions, and application links.",
  alternates: { canonical: "/jobs" },
  openGraph: {
    title: "Job Scraper — Times of Namibia",
    description: "Real-time job listings from Namibian employment portals.",
    type: "website",
    locale: "en_NA",
    siteName: "Times of Namibia",
  },
};

export default function JobsPage() {
  return (
    <TonLayout activePage="jobs">
      <JobScraperView />
    </TonLayout>
  );
}
