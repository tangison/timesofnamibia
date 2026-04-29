import TonLayout from "@/components/ton/TonLayout";
import JobScraperView from "@/components/ton/JobScraperView";

export const metadata = {
  title: "Job Scraper — Namibia Employment Market",
  description:
    "Real-time job market intelligence scraped from CareerPortal, LinkedIn, NamibiaJobs, and NIEIS. Verified listings with salary data, company details, and 6-second refresh cycles.",
  alternates: { canonical: "/jobs" },
};

export default function JobsPage() {
  return (
    <TonLayout activePage="jobs">
      <JobScraperView />
    </TonLayout>
  );
}
