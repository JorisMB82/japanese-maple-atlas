import { Suspense } from 'react';
import CompareClient from '@/components/CompareClient';
import { getCultivars } from '@/lib/data';

export const metadata = { title: 'Compare cultivars' };
export default function ComparePage() {
  return <><section className="pageIntro"><div className="kicker">Comparison workspace</div><h1>See meaningful differences, field by field.</h1><p>Choose any two pilot cultivars. Standardized fields make morphology, seasonal expression, identity, and growing context directly comparable.</p></section><Suspense fallback={<p>Loading comparison…</p>}><CompareClient cultivars={getCultivars()} /></Suspense></>;
}
