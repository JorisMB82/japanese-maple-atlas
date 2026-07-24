export default function RepositoryHealth({ report }){
 return <div className={`healthCard ${report.valid?'healthGood':'healthBad'}`}><div><span className="panelEyebrow">Integrity check</span><h2>{report.valid?'Repository links are valid':'Repository issues detected'}</h2><p>{report.checkedObjects} normalized objects checked across the knowledge layer.</p></div><strong>{report.valid?'PASS':report.issues.length}</strong>{!report.valid&&<ul>{report.issues.map(x=><li key={x}>{x}</li>)}</ul>}</div>;
}
