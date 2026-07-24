import { Suspense } from 'react';
import CompareClient from '@/components/CompareClient';
import { getCultivars } from '@/lib/data';

export default function ComparePage() {
  return <>
    <section className="hero"><div className="kicker">Comparison engine</div><h1>Compare cultivars trait by trait.</h1><p>Select any two pilot records. The same component will scale automatically as RC-006 through RC-025 are added.</p></section>
    <Suspense fallback={<p>Loading comparison…</p>}><CompareClient cultivars={getCultivars()} /></Suspense>
  </>;
}
