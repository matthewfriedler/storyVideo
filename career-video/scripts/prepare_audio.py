#!/usr/bin/env python3
"""Prepare per-scene voiceover clips in public/audio/.

Priority (Phase 6 of the brief):
 1. assets/voiceover.mp3 (Matthew's own recording of the whole script):
    split into 6 clips at the 5 longest pauses → public/audio/scene1..6.mp3
 2. assets/vo_raw/scene1..6.mp3 (the AI voice clips generated with ElevenLabs)
 3. neither → no voiceover (captions-only video; ambient bed only)

Then re-run:  python3 scripts/build_script.py && npx tsx scripts/check_script.ts
"""
import os, re, shutil, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "audio")
os.makedirs(OUT, exist_ok=True)
own = os.path.join(ROOT, "assets", "voiceover.mp3")
ai = [os.path.join(ROOT, "assets", "vo_raw", f"scene{i}.mp3") for i in range(1, 7)]


def run(*a):
    return subprocess.run(a, capture_output=True, text=True)


if os.path.exists(own):
    err = run("ffmpeg", "-hide_banner", "-i", own, "-af", "silencedetect=noise=-35dB:d=0.35", "-f", "null", "-").stderr
    starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", err)]
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", err)]
    dur = float(run("ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", own).stdout)
    gaps = [(e - s, (s + e) / 2) for s, e in zip(starts, ends) if 1.0 < s and e < dur - 1.0]
    if len(gaps) < 5:
        sys.exit("Could not find 5 pauses between scenes in assets/voiceover.mp3. Leave ~1 s of silence between scenes and retry.")
    cuts = sorted(m for _, m in sorted(gaps, reverse=True)[:5])
    bounds = [0.0] + cuts + [dur]
    for i in range(6):
        a, b = bounds[i], bounds[i + 1]
        r = run("ffmpeg", "-v", "error", "-y", "-i", own, "-ss", f"{a:.3f}", "-to", f"{b:.3f}",
                "-af", "silenceremove=start_periods=1:start_threshold=-40dB,areverse,silenceremove=start_periods=1:start_threshold=-40dB,areverse",
                "-c:a", "libmp3lame", "-b:a", "160k", os.path.join(OUT, f"scene{i + 1}.mp3"))
        if r.returncode:
            sys.exit(r.stderr)
    print("Using Matthew's own voiceover (assets/voiceover.mp3), split into 6 scene clips at:", [round(c, 2) for c in cuts])
elif all(os.path.exists(p) for p in ai):
    for i, p in enumerate(ai, 1):
        shutil.copy(p, os.path.join(OUT, f"scene{i}.mp3"))
    print("Using AI voiceover clips from assets/vo_raw/")
else:
    for i in range(1, 7):
        f = os.path.join(OUT, f"scene{i}.mp3")
        if os.path.exists(f):
            os.remove(f)
    print("No voiceover found: captions-only render.")
