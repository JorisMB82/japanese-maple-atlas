'use client';

import { useEffect, useMemo, useState } from 'react';
import StatusBadge from './StatusBadge';
import MediaPlate from './MediaPlate';

const FILTERS = [['species','Species'],['habit','Habit'],['leafForm','Leaf form'],['light','Light'],['sizeClass','Size'],['autumnColor','Autumn colour']];
const initialState={query:'',species:'All',habit:'All',leafForm:'All',light:'All',sizeClass:'All',autumnColor:'All',sort:'relevance'};
const normalize=value=>value||'All';
const includes=(value,expected)=>expected==='All'||String(value||'').toLowerCase().includes(String(expected).toLowerCase());

function readUrlState(){
 if(typeof window==='undefined')return initialState;
 const p=new URLSearchParams(window.location.search);
 return {...initialState,query:p.get('q')||'',species:normalize(p.get('species')),habit:normalize(p.get('habit')),leafForm:normalize(p.get('leaf')),light:normalize(p.get('light')),sizeClass:normalize(p.get('size')),autumnColor:normalize(p.get('autumn')),sort:p.get('sort')||'relevance'};
}
function writeUrlState(s){
 const p=new URLSearchParams();
 if(s.query)p.set('q',s.query); if(s.species!=='All')p.set('species',s.species); if(s.habit!=='All')p.set('habit',s.habit);
 if(s.leafForm!=='All')p.set('leaf',s.leafForm); if(s.light!=='All')p.set('light',s.light); if(s.sizeClass!=='All')p.set('size',s.sizeClass);
 if(s.autumnColor!=='All')p.set('autumn',s.autumnColor); if(s.sort!=='relevance')p.set('sort',s.sort);
 window.history.replaceState({},'',`${window.location.pathname}${p.toString()?`?${p}`:''}${window.location.hash}`);
}
function score(c,q){
 if(!q.trim())return 0; const terms=q.toLowerCase().match(/(?:[^\s"]+|"[^"]*")+/g)||[];
 const hay=[c.id,c.cultivar,c.scientificName,c.species,c.summary,c.habit,c.leafForm,c.light,c.sizeClass,c.springColor,c.summerColor,c.autumnColor,c.bark,...(c.diagnosticTraits||[])].join(' ').toLowerCase();
 let total=0;
 for(const raw of terms){
  const term=raw.replace(/^"|"$/g,''); const sep=term.indexOf(':');
  if(sep>0){const fieldName=term.slice(0,sep),value=term.slice(sep+1),map={species:'species',habit:'habit',leaf:'leafForm',light:'light',size:'sizeClass',autumn:'autumnColor',bark:'bark'},field=map[fieldName];if(!field||!String(c[field]||'').toLowerCase().includes(value))return-1;total+=45;continue;}
  if(!hay.includes(term))return-1;if(c.cultivar.toLowerCase()===term||c.id.toLowerCase()===term)total+=120;else if(c.cultivar.toLowerCase().startsWith(term))total+=80;else if(c.cultivar.toLowerCase().includes(term))total+=55;else total+=10;
 } return total;
}

export default function CultivarExplorer({cultivars,facets={},examples=[]}){
 const[state,setState]=useState(initialState);const[compare,setCompare]=useState([]);
 useEffect(()=>{setState(readUrlState());try{setCompare(JSON.parse(localStorage.getItem('atlas-compare')||'[]').slice(0,2));}catch{setCompare([])}},[]);
 useEffect(()=>{if(typeof window!=='undefined')writeUrlState(state)},[state]);
 useEffect(()=>{if(typeof window!=='undefined')localStorage.setItem('atlas-compare',JSON.stringify(compare))},[compare]);
 const filtered=useMemo(()=>cultivars.map(c=>({...c,_score:score(c,state.query)})).filter(c=>c._score>=0).filter(c=>includes(c.species,state.species)&&includes(c.habit,state.habit)&&includes(c.leafForm,state.leafForm)&&includes(c.light,state.light)&&includes(c.sizeClass,state.sizeClass)&&includes(c.autumnColor,state.autumnColor)).sort((a,b)=>state.sort==='name'?a.cultivar.localeCompare(b.cultivar):state.sort==='species'?a.species.localeCompare(b.species)||a.cultivar.localeCompare(b.cultivar):state.sort==='reference'?a.id.localeCompare(b.id):b._score-a._score||a.id.localeCompare(b.id)),[cultivars,state]);
 const activeFilters=FILTERS.filter(([k])=>state[k]!=='All'),active=state.query||activeFilters.length||state.sort!=='relevance';
 const update=(k,v)=>setState(s=>({...s,[k]:v})),reset=()=>setState(initialState);
 const toggle=slug=>setCompare(c=>c.includes(slug)?c.filter(x=>x!==slug):c.length>=2?[c[1],slug]:[...c,slug]);
 const compareUrl=compare.length?`/compare?a=${compare[0]||''}${compare[1]?`&b=${compare[1]}`:''}`:'/compare';
 return <section aria-labelledby="directory-heading">
  <div className="sectionHeading"><div><div className="kicker">Repository discovery</div><h2 id="directory-heading">Cultivar explorer</h2></div><p>{filtered.length} of {cultivars.length} records</p></div>
  <div className="searchPanel advancedSearchPanel">
   <label className="searchField"><span>Search names, traits, colours, and structured fields</span><input aria-label="Search cultivars" placeholder='Try “red upright” or habit:weeping' value={state.query} onChange={e=>update('query',e.target.value)}/></label>
   {examples.length>0&&<div className="queryExamples"><span>Examples:</span>{examples.map(x=><button type="button" className="queryChip" key={x} onClick={()=>update('query',x)}>{x}</button>)}</div>}
   <div className="filterGrid filterGridSix">{FILTERS.map(([k,l])=><label key={k}><span>{l}</span><select value={state[k]} onChange={e=>update(k,e.target.value)}><option>All</option>{(facets[k]||[]).map(o=><option key={o}>{o}</option>)}</select></label>)}</div>
   <div className="searchToolbar"><label className="sortControl"><span>Sort</span><select value={state.sort} onChange={e=>update('sort',e.target.value)}><option value="relevance">Relevance</option><option value="reference">Reference ID</option><option value="name">Cultivar name</option><option value="species">Species</option></select></label>{active&&<button className="textButton" type="button" onClick={reset}>Clear discovery state</button>}</div>
  </div>
  {compare.length>0&&<div className="compareTray"><div><strong>Comparison tray</strong><span>{compare.length}/2 selected</span></div><div className="compareTrayNames">{compare.map(slug=><button type="button" key={slug} onClick={()=>toggle(slug)}>{cultivars.find(c=>c.slug===slug)?.cultivar||slug} ×</button>)}</div><a className={`button ${compare.length<2?'secondary':''}`} href={compareUrl}>{compare.length===2?'Compare selected':'Choose one more'}</a></div>}
  {filtered.length?<div className="cultivarGrid">{filtered.map(c=><article className="cultivarCard discoveryCard mediaCultivarCard" key={c.id}>
   <div className="cardTop"><span className="referenceId">{c.id}</span><StatusBadge status={c.status}/></div>
   <a className="cardMainLink" href={`/cultivars/${c.slug}`}><MediaPlate media={c.primaryMedia} cultivar={c} compact/><p className="speciesName"><em>{c.species}</em></p><h3>{c.cultivar}</h3><p>{c.summary}</p><div className="traitLine"><span>{c.habit}</span><span>{c.leafForm}</span><span>{c.autumnColor}</span></div></a>
   <div className="cardFooterActions"><a href={`/cultivars/${c.slug}`}>Open profile →</a><button type="button" className={compare.includes(c.slug)?'selectedCompare':''} onClick={()=>toggle(c.slug)}>{compare.includes(c.slug)?'Selected ✓':'Add to compare'}</button></div>
  </article>)}</div>:<div className="empty card"><h3>No matching cultivars</h3><p>Try a broader term or remove a filter.</p><button type="button" onClick={reset}>Reset discovery</button></div>}
 </section>;
}
