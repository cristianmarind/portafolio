#!/usr/bin/env node
/**
 * Merges individual MFE dist/ folders into a single dist/ at project root.
 * Run after `turbo build`. Each MFE builds to packages/{name}/dist/,
 * this script copies them to dist/mfe-{name}/ and the shell to dist/.
 */
import { cpSync, mkdirSync, rmSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outDir = join(root, 'dist');

// Clean and recreate dist/
if (existsSync(outDir)) {
  rmSync(outDir, { recursive: true });
}
mkdirSync(outDir, { recursive: true });

const mfes = ['mfe-hero', 'mfe-experience', 'mfe-skills', 'mfe-achievements', 'mfe-contact', 'mfe-game'];

// Copy shell browser output → dist/
// Angular esbuild builder outputs to dist/shell/browser/
const shellBrowser = join(root, 'packages', 'shell', 'dist', 'shell', 'browser');
const shellDist = join(root, 'packages', 'shell', 'dist', 'shell');
const shellSrc = existsSync(shellBrowser) ? shellBrowser : shellDist;
if (existsSync(shellSrc)) {
  cpSync(shellSrc, outDir, { recursive: true });
  console.log('✓ shell → dist/');
} else {
  console.warn('⚠ shell/dist not found, skipping');
}

// Copy each MFE → dist/mfe-{name}/
for (const mfe of mfes) {
  const mfeDist = join(root, 'packages', mfe, 'dist');
  const target = join(outDir, mfe);
  if (existsSync(mfeDist)) {
    mkdirSync(target, { recursive: true });
    cpSync(mfeDist, target, { recursive: true });
    console.log(`✓ ${mfe} → dist/${mfe}/`);
  } else {
    console.warn(`⚠ ${mfe}/dist not found, skipping`);
  }
}

console.log('\n✅ dist/ assembled successfully');
