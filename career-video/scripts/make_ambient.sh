#!/usr/bin/env bash
# Generates a soft, quiet "city air" bed (filtered brown noise with slow swells) → public/audio/ambient.mp3
set -euo pipefail
cd "$(dirname "$0")/.."
ffmpeg -v error -y -f lavfi -i "anoisesrc=color=brown:amplitude=0.6:duration=82:seed=7" \
  -f lavfi -i "anoisesrc=color=pink:amplitude=0.08:duration=82:seed=11" \
  -filter_complex "[0]lowpass=f=520,highpass=f=60,volume='0.75+0.25*sin(2*PI*t/11)':eval=frame[a];[1]bandpass=f=2400:width_type=h:w=1800,volume='0.35+0.3*sin(2*PI*t/7+1)':eval=frame[b];[a][b]amix=inputs=2:normalize=0,loudnorm=I=-24:TP=-3,aformat=sample_rates=48000:channel_layouts=stereo" \
  -c:a libmp3lame -b:a 128k public/audio/ambient.mp3
echo "wrote public/audio/ambient.mp3"
