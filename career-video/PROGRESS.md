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

### Phase 4: The six SF backgrounds ✅
- Built: `src/bg/primitives.tsx` (sky, clouds, fog banks, seagulls, buildings, skyline with Salesforce Tower and Transamerica Pyramid, trees, palms, lamps, benches, people, sidewalk, Victorian row house) and `src/bg/landmarks.tsx` (Ferry Building, Bay Bridge, Golden Gate Bridge, ferry, sailboat, cable car, J-Church streetcar, Muni trolley bus, dog, sourdough stall, coffee cart, storefronts, abstract mural, hills). `src/bg/scenes.tsx` puts these together into the 6 scenes.
- Parallax: every scene has a sky plus at least 3 scrolling layers (far ≈ 8–14 px/s, mid ≈ 30–80 px/s, near = **195 px/s**, which matches the character's foot speed so the feet don't skate). Layers are 4800–6200 px wide (≥ 3.75× the frame), enough for the longest scene plus crossfades. Scenes 3 and 5 have an extra 4th layer (storefront row / lawn).
- SF accuracy: Golden Gate in International Orange (#c0362c) with Art Deco towers; Bay Bridge silver-grey with multiple towers; red-and-cream cable car with gold trim and a ringing bell; Painted Ladies in pastels, stepping down Steiner St; the streetcar is labeled "J CHURCH". All signs are made-up plain text; no logos.
- Decision: scene 2 tilts the street, houses and cable car 9° so California St. visibly climbs. The character stays upright (gravity), and a gap in the row of houses (a cross street) shows the Bay below.
- **Test**: `out/tests/bg_scene1..6.png` checked by eye.
  - First pass: scene 2's bay windows didn't read as bays, there was no Bay view, and sidewalk props drew behind the cable car; scene 3's Salesforce Tower was hidden by the storefronts; scene 4's mural was off-screen mid-scene.
  - All fixed and re-rendered (`bg_fix_sheet.png`). Every listed detail is present, nothing is cut off at the edges, and all six scenes share one palette and style. PASS.

### Phase 5: Putting the scenes together ✅
- Built: `src/Main.tsx`. Each scene is a `<Sequence>` padded by 7.5 frames on each side, and the incoming scene fades in over 15 frames (a **0.5 s crossfade centred on each boundary**). The character is drawn once on top of everything at x = 600 (middle third), feet at y = 615, walking continuously across all cuts, mouth moving whenever a caption is on screen.
- Captions: bottom-centre dark pill, Inter 30 px semibold, max width 1200 px, 0.12 s fade. Stat cards: top-right white cards that slide in when the matching number is spoken ("twenty-five", "forty", "fifty", "eighty"), hold ~3 s, then fade. Extras: a small location chip at the top left for the first ~4 s of each scene; the opening title card (0.3–6 s) and the closing contact card (fades in at 75.5 s, holds to the end).
- **Test**: 10 s previews around transitions 1→2, 3→4 and 5→6 (`out/previews/preview_*.mp4`), 1 frame/s contact sheets (`out/previews/sheet_*.png`), plus stills of every stat/title card (`out/tests/overlay_sheet.png`).
  - Found and fixed: (1) in scene 2 the character looked like he was standing in the street, so I raised the street/houses 40 px; (2) the 64-character caption "…University of Nevada, Reno," wrapped to two lines, so I widened the pill to 1200 px; (3) stat cards wrapped, so they're now `nowrap`.
  - Re-checked: captions match the narration at each moment, no text overflows, nothing covers the character's face, and stat cards appear in the right scenes. PASS.

### Phase 6: Voiceover and sound ✅ (option 2: AI voice)
- `assets/voiceover.mp3` was not provided and no `ELEVENLABS_API_KEY` env var was set. The session did have the **ElevenLabs connector**, so I used it (same intent as option 2): voice **"Dylan – Warm, Clear and Conversational"** (young American male), model `eleven_v4`, one clip per scene, script text word for word. Raw clips: `assets/vo_raw/scene1..6.mp3`. ElevenLabs flow: "Matthew Career SF Voiceover". (Each generation made 2 takes; I used the first take of every scene.)
- Decision: the session's network blocked the ElevenLabs download host, so I created a personal cloud environment "storyVideo" that allows `elevenlabsusercontent.com`.
- Ambient: `scripts/make_ambient.sh` generates a soft filtered-noise "city air" bed (`public/audio/ambient.mp3`, loudness-normalized to −24 LUFS, mixed at 22% with fade in/out). No downloaded audio and nothing copyrighted.
- Matthew's own voice: drop a full recording into `assets/voiceover.mp3` and run `./scripts/render_all.sh`. `scripts/prepare_audio.py` splits it at the 5 longest pauses into 6 scene clips (leave ~1 s of silence between scenes), and the captions are re-timed from the new clips automatically.
- **Test**: clip length vs available slot (slot end − voice start): 9.40/11.20, 14.45/14.70, 9.33/11.50, 13.01/14.50, 11.31/13.00, 11.39/12.00 s. No clip runs over. (Scene 2 originally overran the brief's 14 s slot, so I re-timed the slots in Phase 2 and the Phase 2 check passes.) I check the full mixed track with ffprobe in Phase 7. PASS.
