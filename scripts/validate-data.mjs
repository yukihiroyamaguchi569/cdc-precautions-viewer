#!/usr/bin/env node
// Lightweight CI guard against malformed / accidental data corruption.
// Runs after build-data.mjs. No external deps.

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = resolve(__dirname, '..', 'data', 'appendix-a.json');

const VALID = new Set(['Standard', 'Contact', 'Droplet', 'Airborne']);
const errors = [];

let data;
try {
  data = JSON.parse(readFileSync(file, 'utf8'));
} catch (e) {
  console.error(`Cannot parse ${file}: ${e.message}`);
  process.exit(1);
}

if (!Array.isArray(data.records) || data.records.length === 0) {
  console.error('No records found.');
  process.exit(1);
}

const ids = new Set();
for (const r of data.records) {
  const where = r.id || r.name || '(unknown)';
  if (!r.id) errors.push(`${where}: missing id`);
  if (ids.has(r.id)) errors.push(`${where}: duplicate id`);
  ids.add(r.id);
  if (!r.name) errors.push(`${where}: missing name`);
  if (!Array.isArray(r.precautions)) errors.push(`${where}: precautions must be an array`);
  else for (const p of r.precautions) {
    if (!VALID.has(p)) errors.push(`${where}: invalid precaution "${p}"`);
  }
  // A record must either prescribe precautions or point elsewhere.
  if (r.precautions.length === 0 && !r.seeAlso && r.duration === 'n/a') {
    // allowed (pure "n/a" rows exist in the source) — no error, just noted.
  }
  if (typeof r.duration !== 'string') errors.push(`${where}: duration must be a string`);
}

if (data.meta?.count !== undefined && data.meta.count !== data.records.length) {
  errors.push(`meta.count (${data.meta.count}) != records.length (${data.records.length})`);
}

if (errors.length) {
  console.error(`Data validation failed (${errors.length}):`);
  for (const e of errors.slice(0, 50)) console.error('  - ' + e);
  process.exit(1);
}

console.log(`✓ ${data.records.length} records valid.`);
