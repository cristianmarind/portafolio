#!/usr/bin/env node
/**
 * Merges individual MFE dist/ folders into a single dist/ at project root.
 * Run after `turbo build`. Each MFE builds to packages/{name}/dist/,
 * this script copies them to dist/mfe-{name}/ and the shell to dist/.
 */
import { cpSync, mkdirSync, rmSync, existsSync, writeFileSync } from 'fs';
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

// Write robots.txt and sitemap.xml
const base = 'https://cristianmarind.github.io/portafolio';
writeFileSync(join(outDir, 'robots.txt'),
  `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`);

writeFileSync(join(outDir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${base}/</loc><changefreq>monthly</changefreq><priority>1.0</priority></url>
</urlset>\n`);

console.log('✓ robots.txt + sitemap.xml written');
console.log('\n✅ dist/ assembled successfully');
