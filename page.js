import CultivarExplorer from '@/components/CultivarExplorer';
import { getCultivars } from '@/lib/data';

export default function Home() {
  const cultivars = getCultivars();
  return <>
    <section className="hero">
      <div className="kicker">Functional MVP · Pilot cohort</div>
      <h1>Find, inspect, and compare Japanese maple cultivars.</h1>
      <p>This interface turns the Atlas repository model into a usable product. Search and comparison are operational now; detailed assertions and evidence will be replaced with the frozen RC-001–RC-005 records during normalization.</p>
    </section>
    <div className="notice"><strong>Data status:</strong> interface-complete pilot seed data. It is deliberately marked provisional and must not be treated as the canonical Reference Standards.</div>
    <CultivarExplorer cultivars={cultivars} />
  </>;
}
