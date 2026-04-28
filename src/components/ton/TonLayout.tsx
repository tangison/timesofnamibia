import Ticker from "./Ticker";
import UtilityNav from "./UtilityNav";
import Masthead from "./Masthead";
import Footer from "./Footer";

export default function TonLayout({
  children,
  activePage,
}: {
  children: React.ReactNode;
  activePage?: string;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-ton-cream">
      <Ticker />
      <UtilityNav />
      <Masthead />
      <main className="flex-1">{children}</main>
      <Footer activePage={activePage} />
    </div>
  );
}
