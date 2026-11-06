# PROGRESS — Matthew's Career Walk Through SF

_(Summary at top is filled in at the end — see "Summary" once Phase 8 is complete.)_

---

## Build log

### Phase 1: Setup ✅
- Built: `career-video/` Remotion 4.0.300 project (TypeScript, React 18), set up by hand (`npx create-video` is interactive).
- Tools: node v22.23.4, npm 10.9.9, ffmpeg/ffprobe at `/usr/bin`, Python 3 + Pillow 12.3 available for fallback (not needed).
- Decision: Remotion uses the pre-installed Chromium headless shell (`remotion.config.ts → setBrowserExecutable`) rather than downloading its own.
- **Test**: `out/test_setup.mp4` → `h264, 1280×720, 30/1 fps, 2.048 s`. PASS.

### Phase 2: Script and timing data ✅
- Built: `scripts/build_script.py` → `src/script.json` (id, location, start/end, narration, 6–10-word caption chunks with times, stat card, title card); `scripts/check_script.ts` validator.
- Decision (timing): **scene slots changed from the brief** to fit the real voiceover (see Phase 6). Scene 2's clip is 14.45 s and wouldn't fit its 14 s slot. New slots: 0–12, 12–27, 27–39, 39–54, 54–67.5, 67.5–80 (total still 80 s).
- Decision (captions): chunks are produced by a small DP that prefers breaking after punctuation and avoids splitting names like "Solutions Expert". Caption times are anchored to real pauses in each clip (ffmpeg `silencedetect`) and interpolated between them.
- **Test**: `npx tsx scripts/check_script.ts`: 6 scenes, no gaps/overlaps, 80 s total, narration matches the brief word for word, captions re-join to the narration exactly, every chunk 6–10 words, no clip runs over its slot. PASS.

```
scene  | location                                | time (s)  | dur  | words | caps | audio/slot
scene1 | Ferry Building, Embarcadero             | 0.0–12.0  | 12.0 | 28    | 3    | 9.40s / 11.20s
scene2 | California Street cable car, Nob Hill   | 12.0–27.0 | 15.0 | 37    | 4    | 14.45s / 14.70s
scene3 | South Park, SoMa                        | 27.0–39.0 | 12.0 | 26    | 3    | 9.33s / 11.50s
scene4 | Dolores Park, Mission District          | 39.0–54.0 | 15.0 | 37    | 4    | 13.01s / 14.50s
scene5 | Alamo Square and the Painted Ladies     | 54.0–67.5 | 13.5 | 35    | 5    | 11.31s / 13.00s
scene6 | Crissy Field and the Golden Gate Bridge | 67.5–80.0 | 12.5 | 36    | 5    | 11.39s / 12.00s
```

### Phase 3: The character ✅
- Built: `src/Character.tsx`, a layered SVG with separate hair, head (face, ear, brows, eyes, nose, mouth), neck, torso (brown crewneck with ribbed collar and hem), near and far arms (upper arm, forearm, cuff, hand), near and far legs (thigh, shin, hem) and white sneakers.
- Walk cycle: 8 key phases per stride, interpolated smoothly over 32 frames (~1.07 s per two-step stride, a natural walking cadence; a literal 8-frame stride at 30 fps would look like running). Legs swing ±21° with knee bend in swing, arms swing opposite the legs, the body bobs ±1.3 px (2.6 px range), and the head nods slightly.
- Blink every 3.4 s (4-frame blink). The mouth flaps (layered sines) while a caption is active.
- **Decision**: hair wasn't specified in the brief → **short dark brown hair with a side part**. To change it, edit `C.hair` / `C.hairHi` in `src/Character.tsx`.
- **Test**: `out/tests/character_{0,8,16,24}.png` (+ `character_sheet.png`) checked visually: clothes match the brief, proportions look natural (head ≈ 1/6 of height), nothing detached. Fix after the first look: the near arm blended into the torso, so I added a darker sleeve outline, and I reduced the swing knee bend 54°→44°. Then I rendered a 3 s walk loop `out/tests/character_walk.mp4` (3.05 s) and checked 8 consecutive frames (`walk_consecutive.png`): motion is continuous and smooth. PASS.
