import Masthead from "./Masthead";
import Footer from "./Footer";
import SearchModal from "./SearchModal";
import ReadingProgress from "./ReadingProgress";

/**
 * Times of Namibia — Premium Layout
 *
 * Stripped down to essentials:
 *   - ReadingProgress (subtle bar at top)
 *   - Masthead (sticky, includes nav + search + off-canvas trigger)
 *   - main content
 *   - Footer (minimalist, dark, Namibian imagery)
 *   - SearchModal (Ctrl+K)
 *
 * Removed: Ticker, UtilityNav, Navigation (redundant with new Masthead),
 * NewsletterSignup (moved to Footer area), Sidebar (unused).
 */
export default function TonLayout({
  children,
}: {
  children: React.ReactNode;
  activePage?: string;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-ton-cream">
      <ReadingProgress />
      <Masthead />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
      <SearchModal />
    </div>
  );
}
