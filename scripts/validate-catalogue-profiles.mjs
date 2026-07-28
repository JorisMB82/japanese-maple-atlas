import { runCatalogueCompiler } from './compile-catalogue-profiles.mjs';

try {
  runCatalogueCompiler({ ...Object.fromEntries(process.argv.slice(2).flatMap((value, index, args) => value.startsWith('--') && args[index + 1] && !args[index + 1].startsWith('--') ? [[value.slice(2), args[index + 1]]] : [])), mode: 'validate' });
} catch (error) {
  console.error(`Catalogue Profile validation: FAIL\n${error.stack || error.message}`);
  process.exit(1);
}
