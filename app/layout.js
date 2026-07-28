import './globals.css';
import './media.css';
import './editorial.css';
import './search.css';
import './graph.css';
import './explorer.css';
import './catalogue.css';
import SiteHeader from '@/components/SiteHeader';

export const metadata = {
  title: { default: 'Japanese Maple Atlas', template: '%s · Japanese Maple Atlas' },
  description: 'An evidence-aware platform for discovering, comparing, inspecting and exploring Japanese maple Catalogue Profiles, Reference Standards and governed relationships.'
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>
    <SiteHeader />
    <main>{children}</main>
    <footer>
      <div><strong>Japanese Maple Atlas</strong><p>Evidence-based cultivar knowledge, presented through a usable public interface.</p></div>
      <div><span>Two-speed publication model</span><span>Catalogue Profiles for breadth</span><span>Reference Standards for deep assurance</span></div>
    </footer>
  </body></html>;
}
