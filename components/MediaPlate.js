import MediaIdentityBadge from './MediaIdentityBadge';

export default function MediaPlate({ media, cultivar, compact = false }) {
  if (!media?.assetPath) {
    const governedGap = cultivar?.mediaState === 'governed-gap';
    const wording = cultivar?.mediaGovernedGap?.publicWording || 'No approved cultivar-specific image is currently available.';
    return <div className={`mediaFallback ${compact ? 'compact' : ''}`} aria-label={governedGap ? wording : `No media available for ${cultivar?.cultivar || 'this cultivar'}`}>
      <span aria-hidden="true">楓</span>
      <p>{governedGap ? wording : 'Media reserved'}</p>
      {governedGap && !compact && <small>No generic or substitute cultivar image is displayed.</small>}
    </div>;
  }

  const identityConfidence = media.identity?.confidence;
  const referenceEvidence = media.evidentiaryStatus === 'illustrative-not-evidence' ? 'Reconstruction · not evidence' : media.evidentiaryStatus;
  return <figure className={`mediaPlate ${compact ? 'compact' : ''}`}>
    <img src={media.assetPath} alt={media.altText || `${cultivar?.cultivar || 'Japanese maple'} governed visual`} loading={compact ? 'lazy' : 'eager'} />
    {identityConfidence && <div className="mediaPlateIdentity"><MediaIdentityBadge confidence={identityConfidence}/></div>}
    {!compact && <figcaption>
      <div><strong>{media.caption}</strong><span>{media.attributionText || media.creator}</span></div>
      <div className="mediaPlateBadges"><MediaIdentityBadge confidence={identityConfidence}/>{referenceEvidence && <span className="mediaEvidenceBadge">{referenceEvidence}</span>}</div>
    </figcaption>}
  </figure>;
}
