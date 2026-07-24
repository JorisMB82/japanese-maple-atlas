import './globals.css';

export const metadata = {
  title: 'Japanese Maple Atlas — Pilot',
  description: 'Evidence-aware cultivar discovery and comparison pilot.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="siteHeader">
          <a className="brand" href="/">Japanese Maple Atlas</a>
          <nav>
            <a href="/">Cultivars</a>
            <a href="/compare">Compare</a>
          </nav>
        </header>
        <main>{children}</main>
        <footer>
          Pilot repository interface · RC-001–RC-005 · Data marked provisional until canonical RC imports are completed.
        </footer>
      </body>
    </html>
  );
}
