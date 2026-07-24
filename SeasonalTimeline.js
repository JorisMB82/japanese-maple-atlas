export default function SeasonalTimeline({ cultivar }) {
  const seasons = [
    ['Spring', cultivar.springColor],
    ['Summer', cultivar.summerColor],
    ['Autumn', cultivar.autumnColor],
    ['Winter structure', cultivar.bark]
  ];
  return <div className="seasonGrid">
    {seasons.map(([label,value], index) => <div className="season" key={label}>
      <span className="seasonNumber">0{index + 1}</span>
      <strong>{label}</strong>
      <p>{value}</p>
    </div>)}
  </div>;
}
