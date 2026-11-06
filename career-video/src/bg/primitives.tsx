import React from 'react';

// ---------- shared palette (keeps all six scenes in one visual family) ----------
export const P = {
  sidewalk: '#ddd6cb',
  sidewalkSeam: '#c9c1b5',
  curb: '#b9b1a5',
  street: '#7b8086',
  streetLine: '#e9e3d2',
  grass: '#93c171',
  grassDark: '#7eab5f',
  foliage: '#6aa35a',
  foliageDark: '#558a4a',
  trunk: '#7a5a43',
  palmTrunk: '#a3825f',
  palmFrond: '#5f9a55',
  water: '#86adc6',
  waterDark: '#719bb6',
  white: '#ffffff',
  ink: '#3a3f47',
  glass: '#7e95ab',
  glassLight: '#a9bccd',
};

export const PASTELS = ['#e9d8c4', '#d6e2e8', '#f0e0cf', '#cfd8e4', '#e9cfc5', '#dde6d1', '#efe3c2', '#d9d0e6'];

// deterministic RNG so every render is identical
export const rng = (seed: number) => {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
};

// ---------- layer: an SVG strip that scrolls left ----------
export const Layer: React.FC<{offset: number; width?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
  offset,
  width = 4800,
  children,
  style,
}) => (
  <svg
    width={width}
    height={720}
    viewBox={`0 0 ${width} 720`}
    style={{position: 'absolute', left: 0, top: 0, transform: `translateX(${-offset}px)`, overflow: 'visible', ...style}}
  >
    {children}
  </svg>
);

export const Sky: React.FC<{top: string; bottom: string; id: string; sun?: {x: number; y: number; r: number; color: string}}> = ({
  top,
  bottom,
  id,
  sun,
}) => (
  <svg width={1280} height={720} style={{position: 'absolute', left: 0, top: 0}}>
    <defs>
      <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={top} />
        <stop offset="0.75" stopColor={bottom} />
      </linearGradient>
      {sun && (
        <radialGradient id={`sun-${id}`}>
          <stop offset="0" stopColor={sun.color} stopOpacity={0.95} />
          <stop offset="0.35" stopColor={sun.color} stopOpacity={0.5} />
          <stop offset="1" stopColor={sun.color} stopOpacity={0} />
        </radialGradient>
      )}
    </defs>
    <rect width={1280} height={720} fill={`url(#sky-${id})`} />
    {sun && <circle cx={sun.x} cy={sun.y} r={sun.r * 3.2} fill={`url(#sun-${id})`} />}
    {sun && <circle cx={sun.x} cy={sun.y} r={sun.r} fill={sun.color} opacity={0.9} />}
  </svg>
);

export const Cloud: React.FC<{x: number; y: number; s?: number; o?: number; color?: string}> = ({x, y, s = 1, o = 0.85, color = '#fff'}) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={o}>
    <ellipse cx={0} cy={0} rx={60} ry={18} fill={color} />
    <ellipse cx={-25} cy={-10} rx={28} ry={18} fill={color} />
    <ellipse cx={18} cy={-16} rx={32} ry={22} fill={color} />
  </g>
);

/** Soft fog band built from overlapping translucent ellipses (no blur filter → fast). */
export const FogBank: React.FC<{x: number; y: number; w: number; h?: number; o?: number; seed?: number; color?: string}> = ({
  x,
  y,
  w,
  h = 40,
  o = 0.5,
  seed = 1,
  color = '#ffffff',
}) => {
  const r = rng(seed);
  const n = Math.max(3, Math.round(w / 90));
  return (
    <g opacity={o}>
      {Array.from({length: n}).map((_, i) => (
        <ellipse key={i} cx={x + (i + 0.5) * (w / n) + (r() - 0.5) * 40} cy={y + (r() - 0.5) * h * 0.5} rx={w / n + 30} ry={h * (0.5 + r() * 0.4)} fill={color} opacity={0.55} />
      ))}
    </g>
  );
};

export const Seagull: React.FC<{x: number; y: number; frame: number; s?: number; phase?: number}> = ({x, y, frame, s = 1, phase = 0}) => {
  const f = Math.sin(frame * 0.35 + phase);
  const wy = -6 * f;
  return (
    <path
      transform={`translate(${x},${y}) scale(${s})`}
      d={`M-14,${wy} Q-7,${-4 + wy * 0.3} 0,2 Q7,${-4 + wy * 0.3} 14,${wy}`}
      stroke="#4b5560"
      strokeWidth={2.2 / s}
      fill="none"
      strokeLinecap="round"
    />
  );
};

/** Plain building with window grid. y = base line. */
export const Building: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  win?: string;
  cols?: number;
  rows?: number;
  roof?: 'flat' | 'step';
  shade?: boolean;
}> = ({x, y, w, h, color, win = 'rgba(255,255,255,0.45)', cols, rows, roof = 'flat', shade = true}) => {
  const c = cols ?? Math.max(2, Math.floor(w / 22));
  const r = rows ?? Math.max(2, Math.floor(h / 26));
  const padX = w * 0.12;
  const padTop = 14;
  const cw = (w - padX * 2) / c;
  const rh = (h - padTop - 10) / r;
  return (
    <g>
      <rect x={x} y={y - h} width={w} height={h} fill={color} />
      {roof === 'step' && <rect x={x + w * 0.2} y={y - h - 12} width={w * 0.6} height={12} fill={color} />}
      {shade && <rect x={x + w * 0.82} y={y - h} width={w * 0.18} height={h} fill="#000" opacity={0.06} />}
      {Array.from({length: r}).map((_, j) =>
        Array.from({length: c}).map((__, i) => (
          <rect key={`${i}-${j}`} x={x + padX + i * cw + cw * 0.2} y={y - h + padTop + j * rh} width={cw * 0.6} height={rh * 0.55} fill={win} />
        )),
      )}
    </g>
  );
};

/** Distant downtown skyline. Optional landmark towers (Salesforce Tower, Transamerica Pyramid). */
export const Skyline: React.FC<{
  x: number;
  y: number;
  w: number;
  seed: number;
  color?: string;
  win?: string;
  maxH?: number;
  salesforce?: number; // x offset of Salesforce Tower
  transamerica?: number; // x offset of Transamerica Pyramid
  scale?: number;
}> = ({x, y, w, seed, color = '#b9c6d3', win = 'rgba(255,255,255,0.35)', maxH = 200, salesforce, transamerica, scale = 1}) => {
  const r = rng(seed);
  const items: React.ReactNode[] = [];
  let cx = x;
  let k = 0;
  while (cx < x + w) {
    const bw = (26 + r() * 46) * scale;
    const bh = (maxH * (0.25 + r() * 0.7)) * scale;
    const tone = r() * 0.08;
    items.push(
      <Building key={k++} x={cx} y={y} w={bw} h={bh} color={color} win={win} roof={r() > 0.75 ? 'step' : 'flat'} shade={false} />,
    );
    if (tone > 0.05) items.push(<rect key={k++} x={cx} y={y - bh} width={bw} height={bh} fill="#fff" opacity={0.12} />);
    cx += bw + r() * 6 * scale;
  }
  return (
    <g>
      {items}
      {transamerica !== undefined && <Transamerica x={x + transamerica} y={y} h={maxH * 1.35 * scale} color={color} />}
      {salesforce !== undefined && <SalesforceTower x={x + salesforce} y={y} h={maxH * 1.6 * scale} color={color} />}
    </g>
  );
};

export const SalesforceTower: React.FC<{x: number; y: number; h: number; color: string}> = ({x, y, h, color}) => {
  const w = h * 0.15;
  return (
    <g>
      <path
        d={`M${x - w / 2},${y} L${x - w * 0.42},${y - h * 0.85} Q${x - w * 0.36},${y - h} ${x},${y - h} Q${x + w * 0.36},${y - h} ${x + w * 0.42},${y - h * 0.85} L${x + w / 2},${y} Z`}
        fill={color}
      />
      <path d={`M${x - w * 0.42},${y - h * 0.85} Q${x - w * 0.36},${y - h} ${x},${y - h} Q${x + w * 0.36},${y - h} ${x + w * 0.42},${y - h * 0.85} Z`} fill="#fff" opacity={0.35} />
      {Array.from({length: 14}).map((_, i) => (
        <line key={i} x1={x - w * 0.44} x2={x + w * 0.44} y1={y - h * 0.08 - i * h * 0.055} y2={y - h * 0.08 - i * h * 0.055} stroke="#fff" strokeOpacity={0.25} strokeWidth={1} />
      ))}
      <rect x={x + w * 0.1} y={y - h * 0.84} width={w * 0.32} height={h * 0.84} fill="#000" opacity={0.05} />
    </g>
  );
};

export const Transamerica: React.FC<{x: number; y: number; h: number; color: string}> = ({x, y, h, color}) => {
  const w = h * 0.2;
  return (
    <g>
      <path d={`M${x - w / 2},${y} L${x},${y - h} L${x + w / 2},${y} Z`} fill={color} />
      <path d={`M${x - w * 0.22},${y - h * 0.48} L${x - w * 0.34},${y - h * 0.48} L${x - w * 0.27},${y - h * 0.7} Z`} fill={color} />
      <path d={`M${x + w * 0.22},${y - h * 0.48} L${x + w * 0.34},${y - h * 0.48} L${x + w * 0.27},${y - h * 0.7} Z`} fill={color} />
      <path d={`M${x},${y - h} L${x + w / 2},${y} L${x + w * 0.15},${y} Z`} fill="#000" opacity={0.06} />
    </g>
  );
};

export const Tree: React.FC<{x: number; y: number; s?: number; color?: string; dark?: string}> = ({x, y, s = 1, color = P.foliage, dark = P.foliageDark}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-5} y={-60} width={10} height={60} fill={P.trunk} />
    <circle cx={0} cy={-88} r={38} fill={color} />
    <circle cx={-26} cy={-70} r={24} fill={color} />
    <circle cx={26} cy={-72} r={26} fill={color} />
    <circle cx={14} cy={-62} r={20} fill={dark} opacity={0.5} />
    <circle cx={-10} cy={-104} r={14} fill="#fff" opacity={0.12} />
  </g>
);

export const Palm: React.FC<{x: number; y: number; s?: number; frame?: number}> = ({x, y, s = 1, frame = 0}) => {
  const sway = Math.sin(frame * 0.05 + x) * 3;
  const fronds = [-150, -120, -85, -55, -25, 10, 35];
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path d="M-6,0 Q-2,-90 4,-178 L10,-178 Q6,-90 6,0 Z" fill={P.palmTrunk} />
      {Array.from({length: 9}).map((_, i) => (
        <line key={i} x1={-4 + i * 0.6} x2={7 + i * 0.4} y1={-20 - i * 18} y2={-22 - i * 18} stroke="#8a6c4e" strokeWidth={2} />
      ))}
      <g transform={`translate(7,-178) rotate(${sway})`}>
        {fronds.map((a, i) => (
          <path key={i} transform={`rotate(${a})`} d="M0,0 Q30,-14 62,6 Q30,-4 0,4 Z" fill={i % 2 ? P.palmFrond : '#6aa65e'} />
        ))}
        <circle r={6} fill="#7c6247" />
      </g>
    </g>
  );
};

export const Lamp: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-3} y={-150} width={6} height={150} fill="#4d5560" />
    <rect x={-7} y={-8} width={14} height={8} fill="#4d5560" />
    <path d="M0,-150 Q0,-162 16,-162" stroke="#4d5560" strokeWidth={5} fill="none" />
    <path d="M10,-164 L26,-164 L22,-156 L14,-156 Z" fill="#4d5560" />
    <rect x={14} y={-156} width={8} height={3} fill="#fff4cf" />
  </g>
);

export const Bench: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-34} y={-26} width={68} height={6} rx={2} fill="#8a6446" />
    <rect x={-34} y={-42} width={68} height={6} rx={2} fill="#8a6446" />
    <rect x={-30} y={-26} width={4} height={26} fill="#4d5560" />
    <rect x={26} y={-26} width={4} height={26} fill="#4d5560" />
    <rect x={-30} y={-44} width={4} height={18} fill="#4d5560" />
    <rect x={26} y={-44} width={4} height={18} fill="#4d5560" />
  </g>
);

const SKIN = ['#f1c9a5', '#d9a47c', '#a8714d', '#7d4f33', '#f4d2b8'];
const SHIRTS = ['#e07a5f', '#3d5a80', '#81b29a', '#f2cc8f', '#9c89b8', '#e5989b', '#5c9ead', '#c9ada7'];

/** Simple background person. pose: stand | sit | sitLaptop | lie */
export const Person: React.FC<{x: number; y: number; seed: number; pose?: 'stand' | 'sit' | 'sitLaptop' | 'lie'; s?: number; flip?: boolean}> = ({
  x,
  y,
  seed,
  pose = 'stand',
  s = 1,
  flip = false,
}) => {
  const r = rng(seed * 7919 + 13);
  const skin = SKIN[Math.floor(r() * SKIN.length)];
  const shirt = SHIRTS[Math.floor(r() * SHIRTS.length)];
  const pants = ['#3f4a5a', '#5b6b7f', '#6d5c4d', '#2f3b4c'][Math.floor(r() * 4)];
  const hair = ['#2b211b', '#5a3d2b', '#c49a5b', '#1d1d1d', '#8a5a3b'][Math.floor(r() * 5)];
  const tr = `translate(${x},${y}) scale(${flip ? -s : s},${s})`;
  if (pose === 'lie') {
    return (
      <g transform={tr}>
        <rect x={-36} y={-12} width={30} height={10} rx={5} fill={pants} />
        <rect x={-8} y={-14} width={30} height={13} rx={6} fill={shirt} />
        <circle cx={30} cy={-9} r={8} fill={skin} />
        <path d="M24,-14 Q30,-20 37,-12 L37,-8 Q31,-14 24,-10 Z" fill={hair} />
      </g>
    );
  }
  if (pose === 'sit' || pose === 'sitLaptop') {
    return (
      <g transform={tr}>
        <rect x={-6} y={-30} width={22} height={9} rx={4} fill={pants} />
        <rect x={10} y={-30} width={8} height={30} rx={4} fill={pants} />
        <rect x={-10} y={-62} width={20} height={36} rx={8} fill={shirt} />
        <circle cx={0} cy={-72} r={10} fill={skin} />
        <path d="M-10,-74 Q-10,-86 1,-85 Q11,-84 10,-74 Q4,-80 -10,-74 Z" fill={hair} />
        {pose === 'sitLaptop' && (
          <g>
            <rect x={4} y={-36} width={24} height={4} rx={1} fill="#9aa3ad" />
            <path d="M24,-36 L30,-56 L33,-55 L27,-36 Z" fill="#c3cad2" />
            <rect x={6} y={-48} width={14} height={6} rx={3} fill={skin} />
          </g>
        )}
      </g>
    );
  }
  return (
    <g transform={tr}>
      <rect x={-8} y={-44} width={7} height={44} rx={3} fill={pants} />
      <rect x={1} y={-44} width={7} height={44} rx={3} fill={pants} />
      <rect x={-11} y={-80} width={22} height={40} rx={8} fill={shirt} />
      <circle cx={0} cy={-90} r={10} fill={skin} />
      <path d="M-10,-92 Q-10,-104 1,-103 Q11,-102 10,-92 Q4,-98 -10,-92 Z" fill={hair} />
    </g>
  );
};

/** Sidewalk band with seams; seams scroll with the near layer. */
export const Sidewalk: React.FC<{x: number; w: number; top: number; color?: string; seam?: string; curb?: string}> = ({
  x,
  w,
  top,
  color = P.sidewalk,
  seam = P.sidewalkSeam,
  curb = P.curb,
}) => (
  <g>
    <rect x={x} y={top} width={w} height={720 - top + 400} fill={color} />
    <rect x={x} y={top} width={w} height={6} fill={curb} />
    {Array.from({length: Math.ceil(w / 150)}).map((_, i) => (
      <line key={i} x1={x + i * 150} x2={x + i * 150 - 40} y1={top + 6} y2={720 + 400} stroke={seam} strokeWidth={2} />
    ))}
  </g>
);

/** Victorian row house with bay window. y = base. */
export const Victorian: React.FC<{x: number; y: number; w: number; h: number; body: string; trim: string; accent?: string; ornate?: boolean}> = ({
  x,
  y,
  w,
  h,
  body,
  trim,
  accent = '#7a8fa6',
  ornate = false,
}) => {
  const roofH = w * 0.42;
  const bayW = w * 0.46;
  const bayX = x + w * 0.08;
  const floorH = (h - 30) / 2;
  return (
    <g>
      {/* body */}
      <rect x={x} y={y - h} width={w} height={h} fill={body} />
      {/* gable roof */}
      <path d={`M${x - 4},${y - h} L${x + w / 2},${y - h - roofH} L${x + w + 4},${y - h} Z`} fill={body} />
      <path d={`M${x - 6},${y - h + 2} L${x + w / 2},${y - h - roofH} L${x + w + 6},${y - h + 2}`} stroke={trim} strokeWidth={5} fill="none" />
      {ornate && <circle cx={x + w / 2} cy={y - h - roofH * 0.45} r={w * 0.07} fill={accent} stroke={trim} strokeWidth={2} />}
      {ornate && (
        <path d={`M${x + w * 0.25},${y - h - roofH * 0.08} L${x + w * 0.75},${y - h - roofH * 0.08}`} stroke={accent} strokeWidth={4} />
      )}
      {/* cornice */}
      <rect x={x - 3} y={y - h - 2} width={w + 6} height={8} fill={trim} />
      {/* bay window (2 floors) */}
      {[0, 1].map((f) => {
        const by = y - 30 - (f + 1) * floorH + 8;
        return (
          <g key={f}>
            <rect x={bayX} y={by} width={bayW} height={floorH - 8} fill="#000" opacity={0.07} />
            <rect x={bayX} y={by} width={7} height={floorH - 8} fill="#000" opacity={0.1} />
            <rect x={bayX + bayW - 7} y={by} width={7} height={floorH - 8} fill="#000" opacity={0.14} />
            <rect x={bayX - 3} y={by - 4} width={bayW + 6} height={5} fill={trim} />
            {[0, 1, 2].map((k) => (
              <rect key={k} x={bayX + 6 + k * ((bayW - 12) / 3) + 3} y={by + 8} width={(bayW - 12) / 3 - 6} height={floorH - 26} fill={P.glass} stroke={trim} strokeWidth={2.5} />
            ))}
            <rect x={bayX - 2} y={by + floorH - 12} width={bayW + 4} height={5} fill={trim} />
            {ornate && <rect x={bayX} y={by + 2} width={bayW} height={4} fill={accent} />}
          </g>
        );
      })}
      {/* door + upper window on the other side */}
      <rect x={x + w * 0.64} y={y - 30 - floorH * 0.85} width={w * 0.22} height={floorH * 0.85} fill={accent} stroke={trim} strokeWidth={3} />
      <rect x={x + w * 0.64} y={y - 30 - floorH * 1.85} width={w * 0.22} height={floorH * 0.6} fill={P.glass} stroke={trim} strokeWidth={3} />
      {/* stairs / garage base */}
      <rect x={x} y={y - 30} width={w} height={30} fill={trim} opacity={0.55} />
      {[0, 1, 2].map((k) => (
        <rect key={k} x={x + w * 0.6 - k * 4} y={y - 30 + k * 10} width={w * 0.3 + k * 8} height={10} fill={trim} opacity={0.9 - k * 0.15} />
      ))}
    </g>
  );
};
