import fs from 'node:fs';

const file = 'lib/search-engine.mjs';
const source = fs.readFileSync(file, 'utf8');
const oldBlock = `  for (const field of fields) {
    const score = scoreFieldMatch(field, document.normalisedFields[field], token.term, false);
    if (score) literalMatches.push({ field, score, term: token.term, semantic: false });
  }

  if (token.semanticConceptId && document.conceptIds.has(token.semanticConceptId)) {
`;
const newBlock = `  const semanticContextMatches = !token.semanticConceptId || document.conceptIds.has(token.semanticConceptId);
  if (semanticContextMatches) {
    for (const field of fields) {
      const score = scoreFieldMatch(field, document.normalisedFields[field], token.term, false);
      if (score) literalMatches.push({ field, score, term: token.term, semantic: false });
    }
  }

  if (token.semanticConceptId && semanticContextMatches) {
`;

if (!source.includes(oldBlock)) throw new Error('Expected scoreToken block was not found.');
fs.writeFileSync(file, source.replace(oldBlock, newBlock));
console.log('Applied semantic context guard to scoreToken.');
