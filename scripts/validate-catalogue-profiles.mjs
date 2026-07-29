import { parseCatalogueCli, runCatalogueCompiler } from './compile-catalogue-profiles.mjs';

try {
  runCatalogueCompiler({ ...parseCatalogueCli(process.argv.slice(2)), mode: 'validate' });
} catch (error) {
  console.error(`Catalogue Profile validation: FAIL\n${error.stack || error.message}`);
  process.exit(1);
}
