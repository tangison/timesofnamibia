import TonLayout from "@/components/ton/TonLayout";
import JobScraperView from "@/components/ton/JobScraperView";

export default function JobsPage() {
  return (
    <TonLayout activePage="jobs">
      <JobScraperView />
    </TonLayout>
  );
}
