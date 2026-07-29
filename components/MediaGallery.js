'use client';

import { useState } from 'react';
import MediaPlate from './MediaPlate';
import MediaIdentityBadge from './MediaIdentityBadge';

export default function MediaGallery({ cultivar }) {
  const [selected, setSelected] = useState(cultivar.media?.find(item => item.isPrimary)?.id || cultivar.media?.[0]?.id || null);
  const active = cultivar.media?.find(item => item.id === selected) || cultivar.media?.find(item => item.isPrimary) || cultivar.media?.[0];
  const target = cultivar.cultivarId || cultivar.id;
  const contributionUrl = `/contribute?target=${encodeURIComponent(target)}&type=media`;

  if (!cultivar.media?.length) {
    const governedGap = cultivar.mediaState === 'governed-gap';
    const wording = cultivar.mediaGovernedGap?.publicWording || 'The repository has no media attached to this cultivar.';
    return <div className="empty card">
      <h3>{governedGap ? 'Governed visual gap' : 'No media objects'}</h3>
      <p>{wording}</p>
      {governedGap && <p>No generic or substitute cultivar image is displayed.</p>}
      {cultivar.publicationClass === 'catalogue-profile' && <p><a className="button secondary" href={contributionUrl}>Submit or help confirm a photograph</a></p>}
    </div>;
  }

  const catalogueMedia = cultivar.publicationClass === 'catalogue-profile';
  return <div className="mediaGallery">
    <MediaPlate media={active} cultivar={cultivar} />
    <div className="mediaMetadata card">
      <div className="kicker">Media object</div>
      <h3>{String(active.role || 'visual').replaceAll('-', ' ')}</h3>
      <dl className="compactDl">
        <dt>Object ID</dt><dd><code>{active.id}</code></dd>
        <dt>Type</dt><dd>{active.mediaType}</dd>
        {!catalogueMedia && <><dt>Subject</dt><dd>{active.subject}</dd></>}
        <dt>Status</dt><dd>{active.status}</dd>
        <dt>Creator</dt><dd>{active.creator}</dd>
        <dt>Rights holder</dt><dd>{active.rightsHolder}</dd>
        {catalogueMedia && <><dt>Rights basis</dt><dd>{active.rightsBasis}</dd></>}
        <dt>Licence</dt><dd>{active.licence}</dd>
        {catalogueMedia && <><dt>Identity confidence</dt><dd><MediaIdentityBadge confidence={active.identity?.confidence}/></dd><dt>Identification basis</dt><dd>{active.identity?.identificationBasis}</dd></>}
        {!catalogueMedia && <><dt>Evidence</dt><dd>{active.evidentiaryStatus}</dd><dt>Style</dt><dd>{active.styleVersion}</dd></>}
        <dt>Derivatives</dt><dd>{active.derivatives?.length || 0}</dd>
      </dl>
      {catalogueMedia ? <>
        <p className="mediaQualification"><strong>{active.identity?.publicQualification}</strong><br />{active.identity?.limitations}</p>
        <p className="mediaAttribution">{active.attributionText}{active.sourceUrl && <> · <a href={active.sourceUrl} target="_blank" rel="noreferrer">Original source</a></>}</p>
        <div className="mediaContributionActions"><a href={contributionUrl}>Report or confirm this identification</a><a href={contributionUrl}>Submit another photograph</a></div>
      </> : <p className="mediaReviewNote"><strong>{active.syntheticLabel}</strong><br />{active.reviewNotes}</p>}
    </div>
    {cultivar.media.length > 1 && <div className="mediaThumbnails">
      {cultivar.media.slice(0, 5).map(item => <button type="button" key={item.id} onClick={() => setSelected(item.id)} className={item.id === active.id ? 'active' : ''}>
        <img src={item.thumbnailPath || item.assetPath} alt="" />
        <span>{item.role}</span>
      </button>)}
    </div>}
  </div>;
}
