#!/usr/bin/env python3
"""Generate src/script.json from the approved script + the voiceover clips.

- Scene slots (start/end) are fixed below; they were widened from the brief's
  original slots so that no voiceover clip runs past its slot (see PROGRESS.md).
- Caption chunks (6-10 words) are made by a small DP that prefers breaking
  after punctuation.
- Caption times are spread across each clip by character weight, then snapped
  to real pauses found with ffmpeg silencedetect.

Run: python3 scripts/build_script.py
"""
import json, os, re, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUDIO_DIR = os.path.join(ROOT, "public", "audio")

SCENES = [
    dict(id="scene1", location="Ferry Building, Embarcadero", start=0.0, end=12.0, voStart=0.8,
         narration="Hi, I'm Matthew. My whole career has been about one thing: helping people get real value out of technology. Let me walk you through how I got here.",
         stat=None, title="Matthew Friedler · Solutions Consulting"),
    dict(id="scene2", location="California Street cable car, Nob Hill", start=12.0, end=27.0, voStart=12.3,
         narration="I studied Information Systems at the University of Nevada, Reno, and built websites for the university. Then at Bridgepointe, I assessed twenty-five client business processes and learned the most important skill in sales: listen first, then recommend.",
         stat="25 business processes assessed", title=None),
    dict(id="scene3", location="South Park, SoMa", start=27.0, end=39.0, voStart=27.5,
         narration="At Sierra Angels, I evaluated more than forty early-stage startups. It taught me how buyers actually make decisions, and what a strong business case looks like.",
         stat="40+ startups evaluated", title=None),
    dict(id="scene4", location="Dolores Park, Mission District", start=39.0, end=54.0, voStart=39.5,
         narration="At Contentsquare, I grew from customer success into a Solutions Expert. I built a working proof of concept on a customer's own data that got fifty users adopting in thirty days, and helped close a one-million-dollar deal.",
         stat="50 users in 30 days → $1M deal", title=None),
    dict(id="scene5", location="Alamo Square and the Painted Ladies", start=54.0, end=67.5, voStart=54.5,
         narration="Across more than eighty accounts, I start with discovery, connect the solution to business outcomes, and build what the customer needs to see. I even build AI agents that help my own team work faster.",
         stat="80+ enterprise accounts", title=None),
    dict(id="scene6", location="Crissy Field and the Golden Gate Bridge", start=67.5, end=80.0, voStart=68.0,
         narration="What I love most is the moment a customer sees what's possible. As a Solutions Consultant, I want to own that moment, from first call to signed deal. I'd love to bring that to your team.",
         stat=None, title="Matthew Friedler · matthewfriedler@gmail.com"),
]


def probe_duration(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path],
                         capture_output=True, text=True, check=True).stdout
    return float(out.strip())


def silences(path):
    err = subprocess.run(["ffmpeg", "-hide_banner", "-i", path, "-af", "silencedetect=noise=-35dB:d=0.18", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", err)]
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", err)]
    return [((s + e) / 2) for s, e in zip(starts, ends)]


def chunk_words(words):
    """DP split into chunks of 6-10 words; cheap to break after punctuation."""
    n = len(words)
    INF = 1e9
    best = [INF] * (n + 1)
    prev = [-1] * (n + 1)
    best[0] = 0
    for i in range(1, n + 1):
        for size in range(6, 11):
            j = i - size
            if j < 0 or best[j] >= INF:
                continue
            last = words[i - 1]
            if i == n or last[-1] in ".!?":
                cost = 0
            elif last[-1] in ",:;":
                cost = 1
            else:
                cost = 6
                if i < n and words[i][0].isupper():
                    cost += 4  # don't split a proper noun like "Solutions Expert"
                if last.lower() in ("a", "the", "of", "to", "in", "on", "my", "that", "is"):
                    cost += 3
            cost += abs(size - 8) * 0.15
            if best[j] + cost < best[i]:
                best[i] = best[j] + cost
                prev[i] = j
    if best[n] >= INF:
        raise SystemExit("cannot chunk: " + " ".join(words))
    out, i = [], n
    while i > 0:
        out.append(words[prev[i]:i])
        i = prev[i]
    return [" ".join(c) for c in reversed(out)]


def time_bounds(chunks, narration, t0, t1, pauses):
    """Map chunk boundaries (character offsets) to times.

    Anchors: each detected pause is matched (in order) to the punctuation mark
    whose proportional time estimate is closest; time is then piecewise-linear
    between anchors."""
    L = len(narration)
    punct = [m.end() for m in re.finditer(r"[.,:;]", narration) if m.end() < L - 1]
    anchors = [(0, t0)]
    used = -1
    for p in sorted(pauses):
        if p <= t0 + 0.3 or p >= t1 - 0.3:
            continue
        cands = [(abs((t0 + (t1 - t0) * c / L) - p), k) for k, c in enumerate(punct) if k > used]
        if not cands:
            break
        err, k = min(cands)
        if err < 1.5:
            anchors.append((punct[k], p))
            used = k
    anchors.append((L, t1))

    def t_at(ci):
        for (c0, a0), (c1, a1) in zip(anchors, anchors[1:]):
            if c0 <= ci <= c1:
                return a0 + (a1 - a0) * (ci - c0) / max(1, c1 - c0)
        return t1

    bounds, pos = [t0], 0
    for c in chunks[:-1]:
        pos += len(c) + 1
        bounds.append(t_at(pos - 1))
    bounds.append(t1)
    return bounds


def main():
    scenes = []
    for s in SCENES:
        path = os.path.join(AUDIO_DIR, f"{s['id']}.mp3")
        has_audio = os.path.exists(path)
        words = s["narration"].split()
        chunks = chunk_words(words)
        if has_audio:
            dur = probe_duration(path)
            pauses = silences(path)
            # speech region: skip leading/trailing silence roughly
            t0, t1 = 0.0, dur
        else:
            dur = None
            pauses = []
            t0, t1 = 0.0, (s["end"] - s["voStart"]) - 0.4
        bounds = time_bounds(chunks, s["narration"], t0, t1, pauses)
        caps = []
        for k, c in enumerate(chunks):
            caps.append(dict(text=c,
                             start=round(s["voStart"] + bounds[k], 3),
                             end=round(s["voStart"] + bounds[k + 1], 3)))
        scenes.append(dict(id=s["id"], location=s["location"], start=s["start"], end=s["end"],
                           narration=s["narration"], voStart=s["voStart"],
                           audio=f"audio/{s['id']}.mp3" if has_audio else None,
                           audioDuration=round(dur, 3) if dur else None,
                           captions=caps, stat=s["stat"], title=s["title"]))
    data = dict(fps=30, width=1280, height=720, totalSeconds=SCENES[-1]["end"], scenes=scenes)
    with open(os.path.join(ROOT, "src", "script.json"), "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print("wrote src/script.json")


if __name__ == "__main__":
    main()
