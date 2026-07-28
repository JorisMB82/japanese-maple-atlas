import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CATALOGUE_COMPILER_VERSION, compileCatalogueDirectory } from '../lib/catalogue-profile-compiler.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const DEFAULT_INPUT = path.join(ROOT, 'atlas-repository', 'catalogue-profiles');
const DEFAULT_SCHEMA = path.join(ROOT, 'atlas-repository', 'schemas', 'catalogue-profile.schema.json');
const DEFAULT_REGISTRY = path.join(DEFAULT_INPUT, 'contract', 'cultivar-identity-registry.json');
const DEFAULT_TAXA = path.join(ROOT, 'atlas-repository', 'reference-standards', 'contract', 'taxa.json');
const json = value => `${JSON.stringify(value, null, 2)}\n`;

function option(args, name) {
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args[index + 1] : undefined;
}

export function parseCatalogueCli(args = process.argv.slice(2)) {
  return {
    mode: args.includes('--validate-only') ? 'validate' : 'check',
    inputDir: option(args, 'input-dir'),
    schemaPath: option(args, 'schema'),
    registryPath: option(args, 'registry'),
    taxaPath: option(args, 'taxa'),
    reportPath: option(args, 'report')
  };
}

export function runCatalogueCompiler(cli = parseCatalogueCli()) {
  const inputDir = path.resolve(cli.inputDir || DEFAULT_INPUT);
  const schemaPath = path.resolve(cli.schemaPath || DEFAULT_SCHEMA);
  const registryPath = path.resolve(cli.registryPath || DEFAULT_REGISTRY);
  const taxaPath = path.resolve(cli.taxaPath || DEFAULT_TAXA);
  const taxa = JSON.parse(fs.readFileSync(taxaPath, 'utf8'));
  const taxonIds = new Set((taxa.taxa || []).map(taxon => taxon.id));
  const result = compileCatalogueDirectory({ inputDir, schemaPath, registryPath, taxonIds });
  const report = {
    compiler: { name: 'Atlas Catalogue Compiler', version: CATALOGUE_COMPILER_VERSION, mode: cli.mode },
    status: 'pass',
    profiles: result.records.length,
    diagnostics: result.diagnostics,
    identityRegistry: { version: result.registry.version, entries: result.registry.entries.length }
  };
  if (cli.reportPath) {
    const target = path.resolve(cli.reportPath);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, json(report));
  }
  console.log(`Atlas Catalogue Compiler ${CATALOGUE_COMPILER_VERSION}: ${cli.mode.toUpperCase()} PASS`);
  console.log(`Canonical Catalogue Profiles: ${result.records.length}`);
  console.log(`Stable cultivar identities: ${result.registry.entries.length}`);
  for (const diagnostic of result.diagnostics) console.log(`PASS  ${diagnostic.id} — ${diagnostic.riskLevel}; ${diagnostic.state}; ${diagnostic.mediaState}`);
  return { result, report };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    runCatalogueCompiler();
  } catch (error) {
    console.error(`Atlas Catalogue Compiler: FAIL\n${error.stack || error.message}`);
    process.exit(1);
  }
}
