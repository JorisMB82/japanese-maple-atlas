import './globals.css';
import './media.css';
import './editorial.css';
import './search.css';
import './graph.css';
import './explorer.css';
import SiteHeader from '@/components/SiteHeader';

export const metadata = {
  title: { default: 'Japanese Maple Atlas', template: '%s · Japanese Maple Atlas' },
  description: 'An evidence-aware platform for discovering, comparing, inspecting and exploring Japanese maple cultivars and their governed relationships.'
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>
    <SiteHeader />
    <main>{children}</main>
    <footer>
      <div><strong>Japanese Maple Atlas</strong><p>Evidence-based cultivar knowledge, presented through a usable public interface.</p></div>
      <div><span>Application v0.10.1</span><span>Sprint 10 usability remediation complete</span><span>Search, graph, comparison, evidence and workspace state remain derived from the governed repository</span></div>
    </footer>
  </body></html>;
}
