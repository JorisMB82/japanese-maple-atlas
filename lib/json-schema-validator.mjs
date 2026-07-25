const typeOf = value => {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (Number.isInteger(value)) return 'integer';
  return typeof value;
};

const printable = value => {
  try { return JSON.stringify(value); } catch { return String(value); }
};

function matchesType(value, requested) {
  const actual = typeOf(value);
  if (requested === 'number') return actual === 'integer' || actual === 'number';
  if (requested === 'object') return actual === 'object';
  return actual === requested;
}

function uniqueArray(values) {
  const seen = new Set();
  for (const value of values) {
    const key = printable(value);
    if (seen.has(key)) return false;
    seen.add(key);
  }
  return true;
}

function resolveLocalRef(rootSchema, reference) {
  if (!reference.startsWith('#/')) throw new Error(`Only local JSON Schema references are supported: ${reference}`);
  return reference.slice(2).split('/').reduce((current, part) => {
    const key = part.replace(/~1/g, '/').replace(/~0/g, '~');
    return current?.[key];
  }, rootSchema);
}

export function validateJsonSchema(value, schema, options = {}) {
  const errors = [];
  const rootSchema = options.rootSchema || schema;
  const rootPath = options.path || '$';

  const visit = (candidate, rule, currentPath) => {
    if (!rule || typeof rule !== 'object') return;

    if (rule.$ref) {
      const resolved = resolveLocalRef(rootSchema, rule.$ref);
      if (!resolved) errors.push({ path: currentPath, keyword: '$ref', message: `unresolved reference ${rule.$ref}` });
      else visit(candidate, resolved, currentPath);
      return;
    }

    if (rule.allOf) rule.allOf.forEach(subschema => visit(candidate, subschema, currentPath));
    if (rule.anyOf && !rule.anyOf.some(subschema => validateJsonSchema(candidate, subschema, { rootSchema, path: currentPath }).valid)) {
      errors.push({ path: currentPath, keyword: 'anyOf', message: 'must match at least one schema' });
    }
    if (rule.oneOf) {
      const matches = rule.oneOf.filter(subschema => validateJsonSchema(candidate, subschema, { rootSchema, path: currentPath }).valid).length;
      if (matches !== 1) errors.push({ path: currentPath, keyword: 'oneOf', message: `must match exactly one schema; matched ${matches}` });
    }
    if (rule.not && validateJsonSchema(candidate, rule.not, { rootSchema, path: currentPath }).valid) {
      errors.push({ path: currentPath, keyword: 'not', message: 'must not match the excluded schema' });
    }

    if (rule.const !== undefined && printable(candidate) !== printable(rule.const)) {
      errors.push({ path: currentPath, keyword: 'const', message: `must equal ${printable(rule.const)}` });
    }
    if (rule.enum && !rule.enum.some(item => printable(item) === printable(candidate))) {
      errors.push({ path: currentPath, keyword: 'enum', message: `must be one of ${rule.enum.map(printable).join(', ')}` });
    }

    if (rule.type) {
      const requestedTypes = Array.isArray(rule.type) ? rule.type : [rule.type];
      if (!requestedTypes.some(type => matchesType(candidate, type))) {
        errors.push({ path: currentPath, keyword: 'type', message: `must be ${requestedTypes.join(' or ')}, found ${typeOf(candidate)}` });
        return;
      }
    }

    if (typeof candidate === 'string') {
      if (rule.minLength !== undefined && candidate.length < rule.minLength) errors.push({ path: currentPath, keyword: 'minLength', message: `must contain at least ${rule.minLength} characters` });
      if (rule.maxLength !== undefined && candidate.length > rule.maxLength) errors.push({ path: currentPath, keyword: 'maxLength', message: `must contain at most ${rule.maxLength} characters` });
      if (rule.pattern && !new RegExp(rule.pattern, 'u').test(candidate)) errors.push({ path: currentPath, keyword: 'pattern', message: `must match ${rule.pattern}` });
      if (rule.format === 'date-time' && Number.isNaN(Date.parse(candidate))) errors.push({ path: currentPath, keyword: 'format', message: 'must be a valid date-time' });
      if (rule.format === 'uri') {
        try { new URL(candidate); } catch { errors.push({ path: currentPath, keyword: 'format', message: 'must be a valid URI' }); }
      }
    }

    if (typeof candidate === 'number') {
      if (rule.minimum !== undefined && candidate < rule.minimum) errors.push({ path: currentPath, keyword: 'minimum', message: `must be at least ${rule.minimum}` });
      if (rule.maximum !== undefined && candidate > rule.maximum) errors.push({ path: currentPath, keyword: 'maximum', message: `must be at most ${rule.maximum}` });
      if (rule.exclusiveMinimum !== undefined && candidate <= rule.exclusiveMinimum) errors.push({ path: currentPath, keyword: 'exclusiveMinimum', message: `must be greater than ${rule.exclusiveMinimum}` });
      if (rule.exclusiveMaximum !== undefined && candidate >= rule.exclusiveMaximum) errors.push({ path: currentPath, keyword: 'exclusiveMaximum', message: `must be less than ${rule.exclusiveMaximum}` });
    }

    if (Array.isArray(candidate)) {
      if (rule.minItems !== undefined && candidate.length < rule.minItems) errors.push({ path: currentPath, keyword: 'minItems', message: `must contain at least ${rule.minItems} items` });
      if (rule.maxItems !== undefined && candidate.length > rule.maxItems) errors.push({ path: currentPath, keyword: 'maxItems', message: `must contain at most ${rule.maxItems} items` });
      if (rule.uniqueItems && !uniqueArray(candidate)) errors.push({ path: currentPath, keyword: 'uniqueItems', message: 'must not contain duplicate items' });
      if (rule.items) candidate.forEach((item, index) => visit(item, rule.items, `${currentPath}[${index}]`));
      if (Array.isArray(rule.prefixItems)) rule.prefixItems.forEach((itemSchema, index) => {
        if (index < candidate.length) visit(candidate[index], itemSchema, `${currentPath}[${index}]`);
      });
    }

    if (candidate && typeof candidate === 'object' && !Array.isArray(candidate)) {
      const keys = Object.keys(candidate);
      if (rule.minProperties !== undefined && keys.length < rule.minProperties) errors.push({ path: currentPath, keyword: 'minProperties', message: `must contain at least ${rule.minProperties} properties` });
      if (rule.maxProperties !== undefined && keys.length > rule.maxProperties) errors.push({ path: currentPath, keyword: 'maxProperties', message: `must contain at most ${rule.maxProperties} properties` });
      for (const required of rule.required || []) {
        if (!Object.prototype.hasOwnProperty.call(candidate, required)) errors.push({ path: currentPath, keyword: 'required', message: `missing required property ${required}` });
      }
      const propertyRules = rule.properties || {};
      for (const [key, propertyValue] of Object.entries(candidate)) {
        if (propertyRules[key]) visit(propertyValue, propertyRules[key], `${currentPath}.${key}`);
        else if (rule.additionalProperties === false) errors.push({ path: `${currentPath}.${key}`, keyword: 'additionalProperties', message: 'property is not allowed' });
        else if (rule.additionalProperties && typeof rule.additionalProperties === 'object') visit(propertyValue, rule.additionalProperties, `${currentPath}.${key}`);
      }
      for (const [pattern, patternRule] of Object.entries(rule.patternProperties || {})) {
        const matcher = new RegExp(pattern, 'u');
        for (const [key, propertyValue] of Object.entries(candidate)) if (matcher.test(key)) visit(propertyValue, patternRule, `${currentPath}.${key}`);
      }
    }
  };

  visit(value, schema, rootPath);
  return { valid: errors.length === 0, errors };
}

export function formatSchemaErrors(errors) {
  return errors.map(error => `${error.path} [${error.keyword}] ${error.message}`);
}
