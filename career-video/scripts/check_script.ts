// Validates src/script.json against the approved script (section 2 of the brief).
// Run: npx tsx scripts/check_script.ts
import fs from 'node:fs';
import path from 'node:path';
import {execSync} from 'node:child_process';

const ROOT = path.resolve(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/script.json'), 'utf8'));

// Reference copy of the narration, verbatim from the brief. Do not edit.
const REFERENCE = [
  "Hi, I'm Matthew. My whole career has been about one thing: helping people get real value out of technology. Let me walk you through how I got here.",
  "I studied Information Systems at the University of Nevada, Reno, and built websites for the university. Then at Bridgepointe, I assessed twenty-five client business processes and learned the most important skill in sales: listen first, then recommend.",
  "At Sierra Angels, I evaluated more than forty early-stage startups. It taught me how buyers actually make decisions, and what a strong business case looks like.",
  "At Contentsquare, I grew from customer success into a Solutions Expert. I built a working proof of concept on a customer's own data that got fifty users adopting in thirty days, and helped close a one-million-dollar deal.",
  "Across more than eighty accounts, I start with discovery, connect the solution to business outcomes, and build what the customer needs to see. I even build AI agents that help my own team work faster.",
  "What I love most is the moment a customer sees what's possible. As a Solutions Consultant, I want to own that moment, from first call to signed deal. I'd love to bring that to your team.",
];
const STATS = [null, '25 business processes assessed', '40+ startups evaluated', '50 users in 30 days → $1M deal', '80+ enterprise accounts', null];

const errors: string[] = [];
const ok = (cond: boolean, msg: string) => { if (!cond) errors.push(msg); };

ok(data.scenes.length === 6, `expected 6 scenes, got ${data.scenes.length}`);
ok(data.scenes[0].start === 0, 'first scene must start at 0');
const rows: string[][] = [];
data.scenes.forEach((s: any, i: number) => {
  if (i > 0) {
    const p = data.scenes[i - 1];
    ok(Math.abs(p.end - s.start) < 1e-6, `gap/overlap between ${p.id} (end ${p.end}) and ${s.id} (start ${s.start})`);
  }
  ok(s.end > s.start, `${s.id} has non-positive duration`);
  ok(s.narration === REFERENCE[i], `${s.id} narration differs from the brief`);
  ok(s.captions.map((c: any) => c.text).join(' ') === REFERENCE[i], `${s.id} caption chunks don't re-join to the narration`);
  s.captions.forEach((c: any, k: number) => {
    const n = c.text.split(/\s+/).length;
    ok(n >= 6 && n <= 10, `${s.id} caption ${k} has ${n} words (want 6-10): "${c.text}"`);
    ok(c.start >= s.start && c.end <= s.end && c.end > c.start, `${s.id} caption ${k} timing ${c.start}-${c.end} outside scene`);
  });
  ok(s.stat === STATS[i], `${s.id} stat card text mismatch`);
  let audioInfo = '—';
  if (s.audio) {
    const f = path.join(ROOT, 'public', s.audio);
    ok(fs.existsSync(f), `${s.id} audio missing: ${f}`);
    if (fs.existsSync(f)) {
      const d = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${f}"`).toString());
      const slotLeft = s.end - s.voStart;
      ok(d <= slotLeft, `${s.id} audio ${d.toFixed(2)}s runs over its slot (${slotLeft.toFixed(2)}s available)`);
      audioInfo = `${d.toFixed(2)}s / ${slotLeft.toFixed(2)}s`;
    }
  }
  rows.push([s.id, s.location, `${s.start.toFixed(1)}–${s.end.toFixed(1)}`, (s.end - s.start).toFixed(1),
    String(s.narration.split(/\s+/).length), String(s.captions.length), audioInfo]);
});
const total = data.scenes[data.scenes.length - 1].end;
ok(total >= 78 && total <= 82, `total ${total}s outside 78–82s`);

const head = ['scene', 'location', 'time (s)', 'dur', 'words', 'caps', 'audio/slot'];
const widths = head.map((h, i) => Math.max(h.length, ...rows.map((r) => r[i].length)));
const line = (r: string[]) => r.map((c, i) => c.padEnd(widths[i])).join(' | ');
console.log(line(head));
console.log(widths.map((w) => '-'.repeat(w)).join('-|-'));
rows.forEach((r) => console.log(line(r)));
console.log(`\nTotal: ${total}s, words: ${REFERENCE.join(' ').split(/\s+/).length}`);
if (errors.length) {
  console.error('\nFAIL:\n - ' + errors.join('\n - '));
  process.exit(1);
}
console.log('\nPASS: script.json is consistent with the brief.');
