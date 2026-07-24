'use client';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const rows = [
  ['Species','species'],['Habit','habit'],['Leaf form','leafForm'],['Size class','sizeClass'],['Spring color','springColor'],['Summer color','summerColor'],['Autumn color','autumnColor'],['Bark','bark'],['Light','light']
];

export default function CompareClient({ cultivars }) {
  const search = useSearchParams();
  const initialA = search.get('a') || cultivars[0].slug;
  const [a,setA] = useState(initialA);
  const [b,setB] = useState(cultivars.find(c=>c.slug!==initialA)?.slug || cultivars[1].slug);
  const left = useMemo(()=>cultivars.find(c=>c.slug===a),[a,cultivars]);
  const right = useMemo(()=>cultivars.find(c=>c.slug===b),[b,cultivars]);
  return <>
    <div className="toolbar" style={{gridTemplateColumns:'1fr 1fr'}}>
      <select value={a} onChange={e=>setA(e.target.value)}>{cultivars.map(c=><option key={c.id} value={c.slug}>{c.cultivar}</option>)}</select>
      <select value={b} onChange={e=>setB(e.target.value)}>{cultivars.map(c=><option key={c.id} value={c.slug}>{c.cultivar}</option>)}</select>
    </div>
    <div className="tableWrap"><table><thead><tr><th>Trait</th><th>{left.cultivar}</th><th>{right.cultivar}</th></tr></thead><tbody>
      {rows.map(([label,key])=><tr key={key}><th>{label}</th><td>{left[key]}</td><td>{right[key]}</td></tr>)}
      <tr><th>Diagnostic traits</th><td>{left.diagnosticTraits.join('; ')}</td><td>{right.diagnosticTraits.join('; ')}</td></tr>
    </tbody></table></div>
  </>;
}
