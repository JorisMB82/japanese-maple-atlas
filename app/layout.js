import './globals.css';
import './media.css';
import './editorial.css';
import './search.css';
import SiteHeader from '@/components/SiteHeader';

export const metadata = {
  title: { default: 'Japanese Maple Atlas', template: '%s · Japanese Maple Atlas' },
  description: 'An evidence-aware platform for discovering, comparing, and inspecting Japanese maple cultivars.'
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>
    <SiteHeader />
    <main>{children}</main>
    <footer>
      <div><strong>Japanese Maple Atlas</strong><p>Evidence-based cultivar knowledge, presented through a usable public interface.</p></div>
      <div><span>Sprint 8</span><span>Semantic discovery operational</span><span>Search interpretations remain governed and explainable</span></div>
    </footer>
  </body></html>;
}
