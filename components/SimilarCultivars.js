export default function SimilarCultivars({ items = [] }) {
  if (!items.length) return <div className="empty card"><p>No similarity candidates are available in the current pilot cohort.</p></div>;

  const label = field => ({
    species: 'same species',
    habit: 'same habit',
    leafForm: 'same leaf form',
    sizeClass: 'same size class',
    light: 'similar light context',
    springColor: 'same spring colour',
    summerColor: 'same summer colour',
    autumnColor: 'same autumn colour',
    bark: 'same bark description',
    diagnosticTraits: 'shared diagnostic trait'
  }[field] || field);

  return <div className="similarGrid">
    {items.map(({ cultivar, score, reasons }) => <a className="similarCard" href={`/cultivars/${cultivar.slug}`} key={cultivar.id}>
      <div className="cardTop"><span className="referenceId">{cultivar.id}</span><strong>{score} match points</strong></div>
      <p className="speciesName"><em>{cultivar.species}</em></p>
      <h3>{cultivar.cultivar}</h3>
      <div className="reasonList">
        {reasons.slice(0, 4).map(reason => <span key={reason}>{label(reason)}</span>)}
      </div>
      <span className="cardAction">Inspect candidate →</span>
    </a>)}
  </div>;
}
