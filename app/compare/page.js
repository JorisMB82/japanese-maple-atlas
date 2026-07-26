import { Suspense } from 'react';
import CompareClient from '@/components/CompareClient';
import { getCultivars } from '@/lib/data';

export const metadata = { title: 'Compare Japanese maple cultivars' };

function CompareLoading() {
  return <section className="compareLoading" role="status" aria-live="polite"><div className="kicker">Comparison workspace</div><h2>Preparing the cultivar selectors…</h2><p>The comparison will appear when the interactive controls are ready. You can also choose records in the <a href="/explorer">Cultivar Explorer</a> and send an explicit pair here.</p></section>;
}

export default function ComparePage() {
  return <>
    <section className="pageIntro"><div className="kicker">Side-by-side cultivar comparison</div><h1>See the differences that matter, field by field.</h1><p>Choose two cultivars to compare growth habit, leaf form, seasonal colour, size, bark and growing context.</p></section>
    <Suspense fallback={<CompareLoading/>}><CompareClient cultivars={getCultivars()} /></Suspense>
  </>;
}
