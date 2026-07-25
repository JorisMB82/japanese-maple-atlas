import test from 'node:test';
import assert from 'node:assert/strict';
import { formatSchemaErrors, validateJsonSchema } from '../../lib/json-schema-validator.mjs';

const schema = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'status', 'scores', 'metadata'],
  properties: {
    id: { type: 'string', pattern: '^ITEM-[0-9]{3}$' },
    status: { enum: ['approved', 'draft'] },
    scores: { type: 'array', minItems: 1, maxItems: 3, uniqueItems: true, items: { type: 'integer', minimum: 1, maximum: 5 } },
    metadata: {
      type: 'object',
      required: ['version'],
      properties: { version: { const: '1.0.0' } },
      additionalProperties: true
    }
  }
};

test('valid documents pass supported JSON Schema keywords', () => {
  const result = validateJsonSchema({ id: 'ITEM-001', status: 'approved', scores: [1, 3, 5], metadata: { version: '1.0.0', note: 'ok' } }, schema);
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
});

test('invalid documents report precise paths and keywords', () => {
  const result = validateJsonSchema({ id: 'bad', status: 'unknown', scores: [0, 0, 6], metadata: {}, extra: true }, schema);
  assert.equal(result.valid, false);
  const keywords = result.errors.map(error => error.keyword);
  assert.ok(keywords.includes('pattern'));
  assert.ok(keywords.includes('enum'));
  assert.ok(keywords.includes('uniqueItems'));
  assert.ok(keywords.includes('minimum'));
  assert.ok(keywords.includes('maximum'));
  assert.ok(keywords.includes('required'));
  assert.ok(keywords.includes('additionalProperties'));
  assert.ok(formatSchemaErrors(result.errors).some(line => line.includes('$.id')));
});

test('type checks distinguish arrays, integers, numbers and null', () => {
  assert.equal(validateJsonSchema([1], { type: 'array' }).valid, true);
  assert.equal(validateJsonSchema(1, { type: 'integer' }).valid, true);
  assert.equal(validateJsonSchema(1, { type: 'number' }).valid, true);
  assert.equal(validateJsonSchema(1.5, { type: 'integer' }).valid, false);
  assert.equal(validateJsonSchema(null, { type: 'null' }).valid, true);
});

test('allOf, anyOf, oneOf and not are supported', () => {
  assert.equal(validateJsonSchema('AB-12', { allOf: [{ type: 'string' }, { pattern: '^AB-' }] }).valid, true);
  assert.equal(validateJsonSchema('green', { anyOf: [{ const: 'red' }, { const: 'green' }] }).valid, true);
  assert.equal(validateJsonSchema(3, { oneOf: [{ type: 'integer' }, { minimum: 10 }] }).valid, true);
  assert.equal(validateJsonSchema(12, { oneOf: [{ type: 'integer' }, { minimum: 10 }] }).valid, false);
  assert.equal(validateJsonSchema('blocked', { not: { const: 'blocked' } }).valid, false);
});

test('local references and escaped JSON pointer segments resolve', () => {
  const referenced = {
    $defs: {
      'id/pattern': { type: 'string', pattern: '^RC-[0-9]{3}$' }
    },
    $ref: '#/$defs/id~1pattern'
  };
  assert.equal(validateJsonSchema('RC-001', referenced).valid, true);
  assert.equal(validateJsonSchema('bad', referenced).valid, false);
});

test('formats, property limits and prefix items are checked', () => {
  const objectResult = validateJsonSchema({ when: 'not-a-date', url: 'not a uri' }, {
    type: 'object',
    minProperties: 2,
    maxProperties: 2,
    properties: {
      when: { type: 'string', format: 'date-time' },
      url: { type: 'string', format: 'uri' }
    }
  });
  assert.equal(objectResult.valid, false);
  const tupleResult = validateJsonSchema(['x', 2], { type: 'array', prefixItems: [{ const: 'x' }, { type: 'integer' }] });
  assert.equal(tupleResult.valid, true);
});
