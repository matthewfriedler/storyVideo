// Render stills from a composition with a single bundle.
// Usage: npx tsx scripts/stills.ts <CompositionId> <outPattern with {f}> <frame> [frame...]
// e.g.   npx tsx scripts/stills.ts Main 'out/tests/frame_{f}.png' 60 150 300
import path from 'node:path';
import fs from 'node:fs';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';

const BROWSER = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';

(async () => {
  const [id, pattern, ...frames] = process.argv.slice(2);
  const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
  const composition = await selectComposition({serveUrl, id, browserExecutable: BROWSER});
  for (const f of frames) {
    const output = pattern.replace('{f}', f);
    fs.mkdirSync(path.dirname(output), {recursive: true});
    await renderStill({composition, serveUrl, output, frame: Number(f), browserExecutable: BROWSER, chromiumOptions: {gl: 'swangle'}});
    console.log('wrote', output);
  }
})().catch((e) => { console.error(e); process.exit(1); });
