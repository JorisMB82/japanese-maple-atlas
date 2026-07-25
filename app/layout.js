import './globals.css';
import './media.css';
import './editorial.css';
import './search.css';
import './graph.css';
import SiteHeader from '@/components/SiteHeader';

export const metadata = {
  title: { default: 'Japanese Maple Atlas', template: '%s · Japanese Maple Atlas' },
  description: 'An evidence-aware platform for discovering, comparing, and inspecting Japanese maple cultivars and their governed relationships.'
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>
    <SiteHeader />
    <main>{children}</main>
    <footer>
      <div><strong>Japanese Maple Atlas</strong><p>Evidence-based cultivar knowledge, presented through a usable public interface.</p></div>
      <div><span>Sprint 9.5</span><span>Testing and quality infrastructure operational</span><span>Repository, schemas, coverage, production export and releases are governed by automated quality gates</span></div>
    </footer>
  </body></html>;
}
