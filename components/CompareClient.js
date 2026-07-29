'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import MediaPlate from './MediaPlate';
import PublicationClassBadge from './PublicationClassBadge';

const groups = [
  ['Identity', [['Species', 'species'], ['Stable cultivar ID', 'cultivarId'], ['Publication class', 'publicationClassLabel'], ['Record ID', 'displayId'], ['Evidence depth', 'evidenceDepth'], ['Data status', 'status']]],
  ['Form', [['Habit', 'habit'], ['Leaf form', 'leafForm'], ['Size class', 'sizeClass'], ['Bark', 'bark']]],
  ['Season', [['Spring colour', 'springColor'], ['Summer colour', 'summerColor'], ['Autumn colour', 'autumnColor']]],
  ['Cultivation', [['Light', 'light']]],
  ['Media', [['Media state', 'mediaState']]]
];

export default function CompareClient({ cultivars }) {
  const search = useSearchParams();
  const validSlugs = useMemo(() => new Set(cultivars.map(cultivar => cultivar.slug)), [cultivars]);
  const requestedA = search.get('a');
  const initialA = validSlugs.has(requestedA) ? requestedA : cultivars[0]?.slug || '';
  const requestedB = search.get('b');
  const initialB = validSlugs.has(requestedB) && requestedB !== initialA
    ? requestedB
    : cultivars.find(cultivar => cultivar.slug !== initialA)?.slug || '';
  const [a, setA] = useState(initialA);
  const [b, setB] = useState(initialB);
  const [differencesOnly, setDifferencesOnly] = useState(false);
  const left = useMemo(() => cultivars.find(cultivar => cultivar.slug === a), [a, cultivars]);
  const right = useMemo(() => cultivars.find(cultivar => cultivar.slug === b), [b, cultivars]);

  useEffect(() => {
    if (!a || !b) return;
    const url = new URL(window.location.href);
    url.searchParams.set('a', a);
    url.searchParams.set('b', b);
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  }, [a, b]);

  if (cultivars.length < 2 || !left || !right) {
    return <section className="empty compareEmpty"><h2>Two cultivar records are needed</h2><p>The current data set does not contain a valid comparison pair.</p><a className="button" href="/explorer">Return to the Cultivar Explorer</a></section>;
  }

  const swap = () => { setA(b); setB(a); };
  return <>
    <section className="comparePairSummary" aria-live="polite"><strong>Comparing {left.cultivar} with {right.cultivar}</strong><span>Publication class and evidence depth are shown explicitly when the records differ.</span></section>
    <div className="compareControls"><label><span>First cultivar</span><select value={a} onChange={event => setA(event.target.value)}>{cultivars.map(cultivar => <option key={cultivar.id} value={cultivar.slug} disabled={cultivar.slug === b}>{cultivar.displayId || cultivar.id} · {cultivar.cultivar} · {cultivar.publicationClassLabel}</option>)}</select></label><button type="button" className="swapButton" aria-label="Swap compared cultivars" onClick={swap}>⇄</button><label><span>Second cultivar</span><select value={b} onChange={event => setB(event.target.value)}>{cultivars.map(cultivar => <option key={cultivar.id} value={cultivar.slug} disabled={cultivar.slug === a}>{cultivar.displayId || cultivar.id} · {cultivar.cultivar} · {cultivar.publicationClassLabel}</option>)}</select></label></div>
    {a === b && <div className="notice"><strong>Choose two different cultivars</strong> to make the comparison meaningful.</div>}
    <div className="compareVisuals">{[left, right].map(cultivar => <article key={cultivar.id}><MediaPlate media={cultivar.primaryMedia} cultivar={cultivar} compact/><span className="referenceId">{cultivar.displayId || cultivar.id}</span><PublicationClassBadge publicationClass={cultivar.publicationClass}/><h2>{cultivar.cultivar}</h2><p><em>{cultivar.scientificName}</em></p><div className="tags">{cultivar.diagnosticTraits.map((trait, index) => <span className="tag" key={`${trait}-${index}`}>{trait}</span>)}</div></article>)}</div>
    <div className="mediaComparisonNotice">Visuals may be governed photographs, illustrations or explicit gaps. They support comparison but do not authenticate a specimen.</div>
    <label className="checkRow"><input type="checkbox" checked={differencesOnly} onChange={event => setDifferencesOnly(event.target.checked)}/> Show differences only</label>
    <div className="comparisonSections">{groups.map(([group, rows]) => {
      const visible = differencesOnly ? rows.filter(([, key]) => left[key] !== right[key]) : rows;
      if (!visible.length) return null;
      return <section className="comparisonGroup" key={group}><h2>{group}</h2><div className="tableWrap"><table><thead><tr><th>Trait</th><th>{left.cultivar}</th><th>{right.cultivar}</th></tr></thead><tbody>{visible.map(([label, key]) => <tr className={left[key] === right[key] ? 'sameValue' : ''} key={key}><th>{label}</th><td>{left[key] || '—'}</td><td>{right[key] || '—'}</td></tr>)}</tbody></table></div></section>;
    })}<section className="comparisonGroup"><h2>Diagnostic traits</h2><div className="compareTraits"><div>{left.diagnosticTraits.map((trait, index) => <span className="tag" key={`${trait}-${index}`}>{trait}</span>)}</div><div>{right.diagnosticTraits.map((trait, index) => <span className="tag" key={`${trait}-${index}`}>{trait}</span>)}</div></div></section></div>
  </>;
}
