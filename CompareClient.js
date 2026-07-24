'use client';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const groups = [
  ['Identity', [['Species','species'],['Reference ID','id'],['Data status','status']]],
  ['Form', [['Habit','habit'],['Leaf form','leafForm'],['Size class','sizeClass'],['Bark','bark']]],
  ['Season', [['Spring color','springColor'],['Summer color','summerColor'],['Autumn color','autumnColor']]],
  ['Cultivation', [['Light','light']]]
];

export default function CompareClient({ cultivars }) {
  const search = useSearchParams();
  const initialA = search.get('a') || cultivars[0].slug;
  const [a,setA] = useState(initialA);
  const [b,setB] = useState(cultivars.find(c=>c.slug!==initialA)?.slug || cultivars[1].slug);
  const [differencesOnly,setDifferencesOnly] = useState(false);
  const left = useMemo(()=>cultivars.find(c=>c.slug===a),[a,cultivars]);
  const right = useMemo(()=>cultivars.find(c=>c.slug===b),[b,cultivars]);
  const swap = () => { setA(b); setB(a); };
  return <>
    <div className="compareControls">
      <label><span>First cultivar</span><select value={a} onChange={e=>setA(e.target.value)}>{cultivars.map(c=><option key={c.id} value={c.slug}>{c.id} · {c.cultivar}</option>)}</select></label>
      <button type="button" className="swapButton" onClick={swap} aria-label="Swap cultivars">⇄</button>
      <label><span>Second cultivar</span><select value={b} onChange={e=>setB(e.target.value)}>{cultivars.map(c=><option key={c.id} value={c.slug}>{c.id} · {c.cultivar}</option>)}</select></label>
    </div>
    {a === b && <div className="notice"><strong>Choose two different cultivars</strong> to make the comparison meaningful.</div>}
    <div className="compareSummary">
      {[left,right].map(c=><article key={c.id}><span className="referenceId">{c.id}</span><h2>{c.cultivar}</h2><p><em>{c.scientificName}</em></p><div className="tags">{c.diagnosticTraits.map(t=><span className="tag" key={t}>{t}</span>)}</div></article>)}
    </div>
    <label className="checkRow"><input type="checkbox" checked={differencesOnly} onChange={e=>setDifferencesOnly(e.target.checked)} /> Show differences only</label>
    <div className="comparisonSections">
      {groups.map(([group,rows]) => {
        const visible = differencesOnly ? rows.filter(([,key])=>left[key]!==right[key]) : rows;
        if (!visible.length) return null;
        return <section className="comparisonGroup" key={group}><h2>{group}</h2><div className="tableWrap"><table><thead><tr><th>Trait</th><th>{left.cultivar}</th><th>{right.cultivar}</th></tr></thead><tbody>{visible.map(([label,key])=><tr className={left[key] === right[key] ? 'sameValue' : ''} key={key}><th>{label}</th><td>{left[key]}</td><td>{right[key]}</td></tr>)}</tbody></table></div></section>;
      })}
      <section className="comparisonGroup"><h2>Diagnostic traits</h2><div className="compareTraits"><div>{left.diagnosticTraits.map(t=><span className="tag" key={t}>{t}</span>)}</div><div>{right.diagnosticTraits.map(t=><span className="tag" key={t}>{t}</span>)}</div></div></section>
    </div>
  </>;
}
