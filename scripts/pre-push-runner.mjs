#!/usr/bin/env node
import { spawnSync } from 'child_process';
import path from 'path';

const repoRoot = process.cwd();
const projectDir = path.join(repoRoot, 'SeaTrack-v3');

function run(cmd, args) {
  const r = spawnSync(cmd, args, { cwd: projectDir, stdio: 'inherit' });
  return r.status || 0;
}

console.log('Running quick pre-push tests (shipment-rest)...');
let code = run('node', ['scripts/test-shipment-rest.mjs']);
if (code !== 0) process.exit(code);
code = run('node', ['scripts/test-shipment-rest-request.mjs']);
if (code !== 0) process.exit(code);

console.log('Pre-push tests passed.');
process.exit(0);
