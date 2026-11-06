#!/usr/bin/env bash
# Full pipeline: audio → script.json → checks → render → poster.
set -euo pipefail
cd "$(dirname "$0")/.."
python3 scripts/prepare_audio.py
[ -f public/audio/ambient.mp3 ] || ./scripts/make_ambient.sh
python3 scripts/build_script.py
npx tsx scripts/check_script.ts
npx remotion render src/index.ts Main out/matthew_career_sf.mp4 --codec=h264 --crf=${CRF:-23} --audio-codec=aac --audio-bitrate=128k
ffmpeg -v error -y -ss 2 -i out/matthew_career_sf.mp4 -frames:v 1 out/poster.png
ls -la out/matthew_career_sf.mp4 out/poster.png
