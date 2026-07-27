import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export const ROOT = path.resolve(import.meta.dirname, '..');
const SIDE = path.join(ROOT, 'atlas-repository/reference-standards/media');
const OUT = path.join(ROOT, 'public/media/derivatives');
export const PROFILES = { thumb:[320,231], card:[560,404], display:[960,693], archive:[1440,1040] };
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const json = file => JSON.parse(fs.readFileSync(file,'utf8'));
const files = () => fs.readdirSync(SIDE).filter(x=>/^RC-\d{3}\.media\.json$/.test(x)).sort();

export function render(svg, profile, width, height) {
  return svg.replace('<svg ', `<svg width="${width}" height="${height}" data-atlas-profile="${profile}" `);
}

export function buildMedia({check=false}={}) {
  const entries=[]; const errors=[];
  for (const name of files()) {
    const sidecar=json(path.join(SIDE,name));
    for (const asset of sidecar.assets) {
      const source=path.join(ROOT,'public',asset.source.path.replace(/^\//,''));
      const svg=fs.readFileSync(source,'utf8');
      if (sha(svg)!==asset.source.sha256) errors.push(`${asset.id}: source checksum mismatch`);
      for (const derivative of asset.derivatives) {
        const dims=PROFILES[derivative.profile];
        if (!dims) { errors.push(`${asset.id}: unknown profile ${derivative.profile}`); continue; }
        const content=render(svg, derivative.profile, ...dims);
        const target=path.join(ROOT, derivative.path.replace(/^\//,''));
        const digest=sha(content);
        if (digest!==derivative.sha256) errors.push(`${asset.id}/${derivative.profile}: declared checksum mismatch`);
        if (check) {
          if (!fs.existsSync(target) || fs.readFileSync(target,'utf8')!==content) errors.push(`${asset.id}/${derivative.profile}: derivative drift`);
        } else { fs.mkdirSync(path.dirname(target),{recursive:true}); fs.writeFileSync(target,content); }
        entries.push({mediaId:asset.id,profile:derivative.profile,path:derivative.path,width:dims[0],height:dims[1],sha256:digest});
      }
    }
  }
  const manifest={version:'media-pipeline-v2',derivativeCount:entries.length,entries};
  const manifestPath=path.join(OUT,'manifest.json');
  const text=`${JSON.stringify(manifest,null,2)}\n`;
  if (check) { if (!fs.existsSync(manifestPath)||fs.readFileSync(manifestPath,'utf8')!==text) errors.push('media derivative manifest drift'); }
  else { fs.mkdirSync(OUT,{recursive:true}); fs.writeFileSync(manifestPath,text); }
  if(errors.length) throw new Error(errors.join('\n'));
  return manifest;
}

if (import.meta.url===`file://${process.argv[1]}`) {
  const check=process.argv.includes('--check');
  const result=buildMedia({check});
  console.log(`Media pipeline: PASS — ${result.derivativeCount} derivatives${check?' verified':' generated'}`);
}
