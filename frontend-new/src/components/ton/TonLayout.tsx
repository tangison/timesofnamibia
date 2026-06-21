import Masthead from "./Masthead";
import Footer from "./Footer";
import SearchModal from "./SearchModal";
import ReadingProgress from "./ReadingProgress";
import CategoryNav from "./CategoryNav";

/**
 * Times of Namibia — Premium Layout
 *
 * Structure:
 *   - ReadingProgress (subtle bar at top)
 *   - Masthead (sticky, includes nav + search + off-canvas trigger)
 *   - CategoryNav (sticky category navigation bar)
 *   - main content
 *   - Footer (minimalist, dark, Namibian imagery)
 *   - SearchModal (Ctrl+K)
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
      <CategoryNav />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
      <SearchModal />
    </div>
  );
}
