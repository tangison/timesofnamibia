import Ticker from "./Ticker";
import UtilityNav from "./UtilityNav";
import Masthead from "./Masthead";
import Navigation from "./Navigation";
import Footer from "./Footer";
import SearchModal from "./SearchModal";
import ReadingProgress from "./ReadingProgress";
import NewsletterSignup from "./NewsletterSignup";
import Sidebar from "./Sidebar";

export default function TonLayout({
  children,
  activePage,
}: {
  children: React.ReactNode;
  activePage?: string;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-ton-cream dark:bg-[#0a0a0a]">
      <ReadingProgress />
      <Ticker />
      <UtilityNav />
      <Masthead />
      <Navigation activePage={activePage} />
      <main className="flex-1">{children}</main>
      <NewsletterSignup />
      <Footer />
      <SearchModal />
    </div>
  );
}
