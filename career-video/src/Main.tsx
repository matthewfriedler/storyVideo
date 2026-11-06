import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import script from './script.json';
import {Character} from './Character';
import {CHAR_X, GROUND_Y, SCENES} from './bg/scenes';

export const FPS = 30;
const XFADE = 15; // 0.5 s crossfade, centred on each scene boundary
const FONT = 'Inter, "Helvetica Neue", Helvetica, Arial, sans-serif';

type Caption = {text: string; start: number; end: number};
type SceneData = (typeof script.scenes)[number];

export const TOTAL_FRAMES = Math.round(script.totalSeconds * FPS);

// ---- which caption is on screen at a given time ----
export const captionAt = (sec: number): Caption | null => {
  for (const s of script.scenes) for (const c of s.captions) if (sec >= c.start && sec < c.end) return c;
  return null;
};

// ---- stat cards: appear when the matching number is spoken ----
const STAT_KEYS: Record<string, string> = {
  scene2: 'twenty-five',
  scene3: 'forty',
  scene4: 'fifty',
  scene5: 'eighty',
};
export const statWindow = (s: SceneData): [number, number] | null => {
  if (!s.stat) return null;
  const key = STAT_KEYS[s.id];
  const cap = s.captions.find((c) => c.text.includes(key)) ?? s.captions[0];
  const start = Math.max(s.start + 0.3, cap.start + 0.2);
  // slide in 0.4 s + hold 3 s + fade 0.5 s
  return [start, Math.min(start + 3.9, s.end)];
};

// ---------------- overlays ----------------
const CaptionPill: React.FC<{sec: number}> = ({sec}) => {
  const c = captionAt(sec);
  if (!c) return null;
  const fade = Math.min(1, (sec - c.start) / 0.12, (c.end - sec) / 0.12);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 34, display: 'flex', justifyContent: 'center', opacity: Math.max(0, fade)}}>
      <div
        style={{
          maxWidth: 1200,
          padding: '12px 28px',
          borderRadius: 999,
          background: 'rgba(24, 28, 36, 0.72)',
          color: '#fff',
          fontFamily: FONT,
          fontSize: 30,
          fontWeight: 600,
          lineHeight: 1.25,
          textAlign: 'center',
          letterSpacing: 0.2,
          boxShadow: '0 6px 24px rgba(0,0,0,0.18)',
        }}
      >
        {c.text}
      </div>
    </div>
  );
};

const StatCard: React.FC<{sec: number}> = ({sec}) => {
  for (const s of script.scenes) {
    const w = statWindow(s);
    if (!w || sec < w[0] || sec >= w[1]) continue;
    const local = sec - w[0];
    const dur = w[1] - w[0];
    const slide = interpolate(local, [0, 0.45], [380, 0], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
    const opacity = interpolate(local, [0, 0.25, dur - 0.5, dur], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    return (
      <div
        style={{
          position: 'absolute',
          top: 36,
          right: 40,
          transform: `translateX(${slide}px)`,
          opacity,
          background: 'rgba(255,255,255,0.94)',
          borderRadius: 18,
          padding: '16px 24px 16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          boxShadow: '0 10px 30px rgba(30,40,60,0.18)',
          fontFamily: FONT,
          whiteSpace: 'nowrap',
        }}
      >
        <div style={{width: 8, alignSelf: 'stretch', borderRadius: 4, background: '#e07a5f'}} />
        <div style={{fontSize: 30, fontWeight: 800, color: '#25303d', letterSpacing: -0.3}}>{s.stat}</div>
      </div>
    );
  }
  return null;
};

const LocationChip: React.FC<{sec: number}> = ({sec}) => {
  const s = script.scenes.find((x) => sec >= x.start && sec < x.end);
  if (!s) return null;
  const local = sec - s.start;
  const opacity = interpolate(local, [0.4, 0.9, 3.6, 4.2], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (opacity <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        top: 36,
        left: 40,
        opacity,
        fontFamily: FONT,
        fontSize: 19,
        fontWeight: 600,
        color: '#25303d',
        background: 'rgba(255,255,255,0.82)',
        padding: '8px 16px',
        borderRadius: 999,
        letterSpacing: 0.4,
      }}
    >
      📍 {s.location}
    </div>
  );
};

const TitleCard: React.FC<{sec: number}> = ({sec}) => {
  // Opening card (scene 1) and closing card (scene 6, fades in near the end).
  const first = script.scenes[0];
  const last = script.scenes[script.scenes.length - 1];
  let text: string | null = null;
  let opacity = 0;
  let y = 0;
  let big = false;
  if (sec < first.end) {
    text = first.title;
    opacity = interpolate(sec, [0.3, 1.0, 5.4, 6.0], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    y = interpolate(sec, [0.3, 1.0], [14, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  } else if (sec >= last.end - 4.5) {
    text = last.title;
    big = true;
    opacity = interpolate(sec, [last.end - 4.5, last.end - 3.3], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    y = interpolate(sec, [last.end - 4.5, last.end - 3.3], [14, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  }
  if (!text || opacity <= 0) return null;
  const [name, rest] = text.split(' · ');
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: big ? 70 : 92, display: 'flex', justifyContent: 'center', opacity, transform: `translateY(${y}px)`}}>
      <div
        style={{
          background: 'rgba(255,255,255,0.92)',
          borderRadius: 22,
          padding: big ? '22px 40px' : '16px 32px',
          textAlign: 'center',
          fontFamily: FONT,
          boxShadow: '0 12px 36px rgba(30,40,60,0.18)',
        }}
      >
        <div style={{fontSize: big ? 46 : 40, fontWeight: 800, color: '#25303d', letterSpacing: -0.5}}>{name}</div>
        <div style={{fontSize: big ? 26 : 23, fontWeight: 500, color: '#c0563f', marginTop: 4}}>{rest}</div>
      </div>
    </div>
  );
};

// ---------------- main composition ----------------
export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const sec = frame / FPS;
  const talking = captionAt(sec) !== null;
  return (
    <AbsoluteFill style={{background: '#dfe8ef'}}>
      {script.scenes.map((s, i) => {
        const S = SCENES[i];
        const from = Math.round(s.start * FPS) - (i > 0 ? XFADE / 2 : 0);
        const to = Math.round(s.end * FPS) + (i < script.scenes.length - 1 ? XFADE / 2 : 0);
        return (
          <Sequence key={s.id} from={from} durationInFrames={to - from} name={s.id}>
            <SceneLayer index={i} startFrame={Math.round(s.start * FPS)} fadeIn={i > 0} />
          </Sequence>
        );
      })}
      <Character frame={frame} x={CHAR_X} groundY={GROUND_Y} talking={talking} />
      <LocationChip sec={sec} />
      <TitleCard sec={sec} />
      <StatCard sec={sec} />
      <CaptionPill sec={sec} />
      {/* audio */}
      {script.scenes.map((s) =>
        s.audio ? (
          <Sequence key={`a-${s.id}`} from={Math.round(s.voStart * FPS)} name={`vo-${s.id}`}>
            <Audio src={staticFile(s.audio)} />
          </Sequence>
        ) : null,
      )}
      <Audio src={staticFile('audio/ambient.mp3')} volume={(f) => interpolate(f, [0, 30, TOTAL_FRAMES - 45, TOTAL_FRAMES], [0, 0.22, 0.22, 0], {extrapolateRight: 'clamp'})} />
    </AbsoluteFill>
  );
};

const SceneLayer: React.FC<{index: number; startFrame: number; fadeIn: boolean}> = ({index, startFrame, fadeIn}) => {
  const local = useCurrentFrame(); // frame within the Sequence
  const S = SCENES[index];
  const from = startFrame - (fadeIn ? XFADE / 2 : 0);
  const global = from + local;
  const opacity = fadeIn ? interpolate(local, [0, XFADE], [0, 1], {extrapolateRight: 'clamp'}) : 1;
  return (
    <AbsoluteFill style={{opacity}}>
      <S t={(global - startFrame) / FPS} frame={global} />
    </AbsoluteFill>
  );
};
