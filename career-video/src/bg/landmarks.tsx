import React from 'react';
import {P} from './primitives';

// ---------------- Ferry Building ----------------
export const FerryBuilding: React.FC<{x: number; y: number}> = ({x, y}) => {
  const W = 900; // long low building
  const H = 110;
  const stone = '#ece0c8';
  const stoneShade = '#dccdb1';
  const roof = '#8f9aa6';
  const tx = x + W / 2; // tower centre
  const tw = 70;
  const tH = 300;
  const t = new Date(0); // fixed time 8:10 for the clock
  void t;
  return (
    <g>
      {/* roof */}
      <path d={`M${x - 10},${y - H} L${x + 20},${y - H - 26} L${x + W - 20},${y - H - 26} L${x + W + 10},${y - H} Z`} fill={roof} />
      {/* main body */}
      <rect x={x} y={y - H} width={W} height={H} fill={stone} />
      <rect x={x} y={y - H} width={W} height={8} fill={stoneShade} />
      <rect x={x} y={y - 46} width={W} height={5} fill={stoneShade} />
      {/* arcade of arched windows, two storeys */}
      {Array.from({length: 22}).map((_, i) => {
        const ax = x + 18 + i * 39.5;
        if (Math.abs(ax + 12 - tx) < tw / 2 + 10) return null;
        return (
          <g key={i}>
            <path d={`M${ax},${y - 2} L${ax},${y - 30} Q${ax + 12},${y - 44} ${ax + 24},${y - 30} L${ax + 24},${y - 2} Z`} fill={P.glass} />
            <path d={`M${ax + 2},${y - 58} L${ax + 2},${y - 80} Q${ax + 12},${y - 90} ${ax + 22},${y - 80} L${ax + 22},${y - 58} Z`} fill={P.glass} opacity={0.85} />
          </g>
        );
      })}
      {/* clock tower */}
      <rect x={tx - tw / 2} y={y - tH} width={tw} height={tH} fill={stone} />
      <rect x={tx + tw * 0.22} y={y - tH} width={tw * 0.28} height={tH} fill={stoneShade} />
      {Array.from({length: 5}).map((_, i) => (
        <rect key={i} x={tx - 9} y={y - H - 30 - i * 30} width={18} height={20} rx={8} fill={P.glass} opacity={0.8} />
      ))}
      {/* entrance arch */}
      <path d={`M${tx - 22},${y} L${tx - 22},${y - 50} Q${tx},${y - 76} ${tx + 22},${y - 50} L${tx + 22},${y} Z`} fill="#6f8399" />
      {/* clock stage */}
      <rect x={tx - tw / 2 - 8} y={y - tH - 8} width={tw + 16} height={12} fill={stoneShade} />
      <rect x={tx - tw / 2 + 2} y={y - tH - 78} width={tw - 4} height={72} fill={stone} />
      <circle cx={tx} cy={y - tH - 42} r={24} fill="#fbf7ee" stroke="#5b5f66" strokeWidth={3} />
      <line x1={tx} y1={y - tH - 42} x2={tx} y2={y - tH - 60} stroke="#3b3f45" strokeWidth={3} strokeLinecap="round" />
      <line x1={tx} y1={y - tH - 42} x2={tx + 12} y2={y - tH - 38} stroke="#3b3f45" strokeWidth={3} strokeLinecap="round" />
      {/* upper stages + cupola */}
      <rect x={tx - tw / 2 - 4} y={y - tH - 86} width={tw + 8} height={10} fill={stoneShade} />
      <rect x={tx - 24} y={y - tH - 130} width={48} height={44} fill={stone} />
      {[0, 1, 2].map((k) => (
        <rect key={k} x={tx - 18 + k * 14} y={y - tH - 124} width={8} height={30} rx={4} fill={P.glass} opacity={0.8} />
      ))}
      <rect x={tx - 28} y={y - tH - 136} width={56} height={8} fill={stoneShade} />
      <rect x={tx - 15} y={y - tH - 164} width={30} height={28} fill={stone} />
      <path d={`M${tx - 18},${y - tH - 164} Q${tx},${y - tH - 196} ${tx + 18},${y - tH - 164} Z`} fill={roof} />
      <line x1={tx} y1={y - tH - 190} x2={tx} y2={y - tH - 228} stroke="#5b5f66" strokeWidth={3} />
      <path d={`M${tx},${y - tH - 228} L${tx + 22},${y - tH - 222} L${tx},${y - tH - 214} Z`} fill="#3f6fa6" />
    </g>
  );
};

// ---------------- Bay Bridge (silver-grey suspension, West span) ----------------
export const BayBridge: React.FC<{x: number; y: number; w: number; color?: string}> = ({x, y, w, color = '#a3acb5'}) => {
  const towers = 5;
  const span = w / (towers + 1);
  const th = 95;
  const tx = Array.from({length: towers}).map((_, i) => x + span * (i + 1));
  return (
    <g>
      <rect x={x} y={y} width={w} height={6} fill={color} />
      <rect x={x} y={y + 6} width={w} height={3} fill="#000" opacity={0.08} />
      {tx.map((t, i) => (
        <g key={i}>
          <rect x={t - 7} y={y - th} width={4} height={th + 30} fill={color} />
          <rect x={t + 3} y={y - th} width={4} height={th + 30} fill={color} />
          {[0.15, 0.5, 0.85].map((f) => (
            <rect key={f} x={t - 7} y={y - th * f} width={14} height={3} fill={color} />
          ))}
        </g>
      ))}
      {[x, ...tx].map((a, i) => {
        const b = i < tx.length ? tx[i] : x + w;
        const ya = i === 0 ? y : y - th;
        const yb = i === tx.length ? y : y - th;
        const nb = i < tx.length ? tx[i] : x + w;
        void b;
        const mx = (a + nb) / 2;
        return (
          <g key={`c${i}`}>
            <path d={`M${a},${ya} Q${mx},${y + 10} ${nb},${yb}`} stroke={color} strokeWidth={2.5} fill="none" />
            {Array.from({length: 7}).map((_, k) => {
              const u = (k + 1) / 8;
              const px = a + (nb - a) * u;
              const py = (1 - u) * (1 - u) * ya + 2 * (1 - u) * u * (y + 10) + u * u * yb;
              return <line key={k} x1={px} x2={px} y1={py} y2={y} stroke={color} strokeWidth={1} opacity={0.8} />;
            })}
          </g>
        );
      })}
    </g>
  );
};

// ---------------- Golden Gate Bridge (International Orange) ----------------
export const GoldenGate: React.FC<{x: number; y: number; w: number; color?: string}> = ({x, y, w, color = '#c0362c'}) => {
  const t1 = x + w * 0.26;
  const t2 = x + w * 0.74;
  const th = 250;
  const Tower: React.FC<{cx: number}> = ({cx}) => (
    <g>
      {/* two legs with stepped Art Deco tiers and portal openings */}
      <rect x={cx - 18} y={y - th} width={10} height={th + 60} fill={color} />
      <rect x={cx + 8} y={y - th} width={10} height={th + 60} fill={color} />
      {[0.08, 0.3, 0.52, 0.74].map((f, i) => (
        <rect key={i} x={cx - 18} y={y - th + th * f} width={36} height={8 - i} fill={color} />
      ))}
      <rect x={cx - 20} y={y - th - 6} width={40} height={8} fill={color} />
      <rect x={cx - 16} y={y - th - 14} width={32} height={8} fill={color} />
      <rect x={cx + 8} y={y - th} width={4} height={th + 60} fill="#000" opacity={0.12} />
    </g>
  );
  const cable = (a: number, ya: number, b: number, yb: number, sag: number) => {
    const mx = (a + b) / 2;
    const my = sag;
    const sus = Array.from({length: Math.floor((b - a) / 12)}).map((_, k) => {
      const u = (k + 1) / (Math.floor((b - a) / 12) + 1);
      const px = (1 - u) * (1 - u) * a + 2 * (1 - u) * u * mx + u * u * b;
      const py = (1 - u) * (1 - u) * ya + 2 * (1 - u) * u * my + u * u * yb;
      return <line key={k} x1={px} x2={px} y1={py} y2={y} stroke={color} strokeWidth={1} opacity={0.75} />;
    });
    return (
      <g>
        <path d={`M${a},${ya} Q${mx},${my} ${b},${yb}`} stroke={color} strokeWidth={3.5} fill="none" />
        {sus}
      </g>
    );
  };
  return (
    <g>
      {cable(x, y - 20, t1, y - th, y - th * 0.35)}
      {cable(t1, y - th, t2, y - th, y + th * 0.72)}
      {cable(t2, y - th, x + w, y - 20, y - th * 0.35)}
      {/* deck with truss */}
      <rect x={x} y={y} width={w} height={9} fill={color} />
      <rect x={x} y={y + 9} width={w} height={6} fill="#8f2a22" />
      {Array.from({length: Math.floor(w / 14)}).map((_, k) => (
        <line key={k} x1={x + k * 14} x2={x + k * 14 + 7} y1={y + 9} y2={y + 15} stroke={color} strokeWidth={1.2} />
      ))}
      <Tower cx={t1} />
      <Tower cx={t2} />
    </g>
  );
};

// ---------------- vehicles ----------------
export const Ferry: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-80,0 L80,0 L70,16 L-72,16 Z" fill="#f6f6f2" />
    <rect x={-80} y={6} width={160} height={4} fill="#3e6f9e" />
    <rect x={-58} y={-18} width={112} height={18} fill="#ffffff" />
    {Array.from({length: 9}).map((_, i) => (
      <rect key={i} x={-52 + i * 12} y={-14} width={8} height={8} fill={P.glass} />
    ))}
    <rect x={-30} y={-32} width={56} height={14} fill="#f3f3ef" />
    <rect x={-6} y={-44} width={8} height={12} fill="#3e6f9e" />
    <path d="M-90,16 Q-60,22 -20,18" stroke="#fff" strokeWidth={2} opacity={0.6} fill="none" />
  </g>
);

export const Sailboat: React.FC<{x: number; y: number; s?: number; frame: number}> = ({x, y, s = 1, frame}) => {
  const bob = Math.sin(frame * 0.12) * 1.5;
  return (
    <g transform={`translate(${x},${y + bob}) scale(${s})`}>
      <path d="M-26,0 L26,0 L18,9 L-20,9 Z" fill="#f4f1ea" />
      <line x1={0} y1={0} x2={0} y2={-60} stroke="#6b6f75" strokeWidth={2} />
      <path d="M2,-58 L2,-4 L32,-4 Z" fill="#ffffff" />
      <path d="M-2,-52 L-2,-6 L-24,-6 Z" fill="#f2ead8" />
      <path d="M-34,11 Q0,15 34,11" stroke="#fff" strokeWidth={2} opacity={0.5} fill="none" />
    </g>
  );
};

/** San Francisco cable car: maroon/red body, cream window band, open grip section. */
export const CableCar: React.FC<{x: number; y: number; frame: number; s?: number}> = ({x, y, frame, s = 1}) => {
  const red = '#b5332c';
  const cream = '#f1e4c6';
  const ringT = frame % 75;
  const ring = ringT < 18;
  const bellRot = ring ? Math.sin(ringT * 1.1) * 18 : 0;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {/* roof */}
      <path d="M-118,-112 Q0,-128 118,-112 L112,-104 L-112,-104 Z" fill={red} />
      <rect x={-70} y={-120} width={140} height={10} rx={3} fill="#9b2b25" />
      {/* body */}
      <rect x={-112} y={-104} width={224} height={62} fill={cream} />
      {/* enclosed middle section windows */}
      {Array.from({length: 6}).map((_, i) => (
        <rect key={i} x={-46 + i * 16} y={-96} width={12} height={30} rx={2} fill="#6f8399" />
      ))}
      {/* passengers silhouettes in windows */}
      {[-40, -8, 24].map((px, i) => (
        <circle key={i} cx={px} cy={-80} r={5} fill="#3e4a57" opacity={0.6} />
      ))}
      {/* open ends with poles */}
      {[-108, -84, 84, 108].map((px) => (
        <rect key={px} x={px - 2} y={-104} width={4} height={62} fill="#7c2420" />
      ))}
      {/* riders on running boards */}
      <g>
        <rect x={-100} y={-82} width={12} height={28} rx={5} fill="#3d5a80" />
        <circle cx={-94} cy={-90} r={7} fill="#e8b996" />
        <rect x={92} y={-82} width={12} height={28} rx={5} fill="#81b29a" />
        <circle cx={98} cy={-90} r={7} fill="#c99470" />
      </g>
      {/* lower body + gold trim */}
      <rect x={-118} y={-46} width={236} height={30} fill={red} />
      <rect x={-118} y={-46} width={236} height={4} fill="#d8b25a" />
      <rect x={-118} y={-20} width={236} height={4} fill="#d8b25a" />
      <text x={0} y={-25} fontSize={12} textAnchor="middle" fill="#f1e4c6" fontFamily="Georgia, serif" fontWeight={700}>
        CALIFORNIA ST.
      </text>
      {/* running board */}
      <rect x={-124} y={-16} width={248} height={5} fill="#5b2a22" />
      {/* wheels */}
      {[-80, -56, 56, 80].map((wx) => (
        <circle key={wx} cx={wx} cy={-6} r={8} fill="#3c3f44" />
      ))}
      {/* bell on roof */}
      <g transform={`translate(0,-122) rotate(${bellRot})`}>
        <path d="M-7,0 Q-7,-14 0,-14 Q7,-14 7,0 Z" fill="#d8b25a" />
        <circle cx={0} cy={1} r={2} fill="#a5853d" />
      </g>
      {ring && (
        <g stroke="#d8b25a" strokeWidth={2.4} fill="none" strokeLinecap="round" opacity={1 - ringT / 18}>
          <path d="M14,-142 Q22,-136 14,-128" />
          <path d="M20,-148 Q32,-136 20,-122" />
          <path d="M-14,-142 Q-22,-136 -14,-128" />
          <path d="M-20,-148 Q-32,-136 -20,-122" />
        </g>
      )}
    </g>
  );
};

/** Muni light-rail streetcar (J-Church). */
export const Streetcar: React.FC<{x: number; y: number; s?: number; label?: string}> = ({x, y, s = 1, label = 'J CHURCH'}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-10,-104 L-30,-128 M-30,-128 L10,-128" stroke="#4d5560" strokeWidth={3} fill="none" />
    <path d="M-150,-100 Q-150,-104 -140,-104 L140,-104 Q154,-104 156,-80 L158,-14 L-150,-14 Z" fill="#e7e9ec" />
    <rect x={-150} y={-46} width={308} height={10} fill="#c63a32" />
    {Array.from({length: 9}).map((_, i) => (
      <rect key={i} x={-140 + i * 30} y={-90} width={24} height={34} rx={3} fill="#5f7286" />
    ))}
    <path d="M136,-90 L150,-90 Q154,-80 154,-56 L136,-56 Z" fill="#5f7286" />
    <rect x={-40} y={-100} width={64} height={8} rx={2} fill="#2f3b4c" />
    <text x={-8} y={-93} fontSize={7} fill="#ffb648" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={700}>
      {label}
    </text>
    {[-110, -84, 84, 110].map((wx) => (
      <circle key={wx} cx={wx} cy={-10} r={9} fill="#3c3f44" />
    ))}
  </g>
);

/** Muni trolley bus with poles. */
export const MuniBus: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <line x1={-20} y1={-98} x2={-70} y2={-150} stroke="#4d5560" strokeWidth={3} />
    <line x1={-6} y1={-98} x2={-56} y2={-150} stroke="#4d5560" strokeWidth={3} />
    <path d="M-120,-96 L112,-96 Q124,-96 124,-80 L124,-14 L-120,-14 Z" fill="#eef0f2" />
    <rect x={-120} y={-36} width={244} height={9} fill="#c63a32" />
    {Array.from({length: 7}).map((_, i) => (
      <rect key={i} x={-112 + i * 30} y={-86} width={25} height={36} rx={3} fill="#4f6175" />
    ))}
    <rect x={104} y={-86} width={16} height={46} rx={3} fill="#4f6175" />
    <rect x={-36} y={-96} width={40} height={6} fill="#2f3b4c" />
    {[-82, 84].map((wx) => (
      <circle key={wx} cx={wx} cy={-12} r={11} fill="#3c3f44" />
    ))}
  </g>
);

export const Dog: React.FC<{x: number; y: number; frame: number; s?: number}> = ({x, y, frame, s = 1}) => {
  const p = frame * 0.9;
  const a = Math.sin(p) * 28;
  const b = Math.sin(p + Math.PI) * 28;
  const bob = Math.abs(Math.sin(p)) * -3;
  const fur = '#b07a48';
  return (
    <g transform={`translate(${x},${y + bob}) scale(${s})`}>
      <g transform="translate(-14,-14)">
        <rect transform={`rotate(${a})`} x={-2} y={0} width={5} height={15} rx={2} fill={fur} />
      </g>
      <g transform="translate(14,-14)">
        <rect transform={`rotate(${b})`} x={-2} y={0} width={5} height={15} rx={2} fill={fur} />
      </g>
      <ellipse cx={0} cy={-20} rx={22} ry={10} fill={fur} />
      <g transform="translate(-10,-14)">
        <rect transform={`rotate(${b})`} x={-2} y={0} width={5} height={15} rx={2} fill="#9c6a3c" />
      </g>
      <g transform="translate(18,-14)">
        <rect transform={`rotate(${a})`} x={-2} y={0} width={5} height={15} rx={2} fill="#9c6a3c" />
      </g>
      <circle cx={24} cy={-30} r={9} fill={fur} />
      <ellipse cx={33} cy={-28} rx={6} ry={4} fill={fur} />
      <circle cx={38} cy={-29} r={2} fill="#2a2522" />
      <path d="M20,-37 L24,-46 L28,-36 Z" fill="#8c5c33" />
      <circle cx={26} cy={-32} r={1.6} fill="#2a2522" />
      <path d={`M-22,-24 Q-34,${-34 + Math.sin(p * 2) * 5} -36,-38`} stroke={fur} strokeWidth={4} fill="none" strokeLinecap="round" />
      <rect x={18} y={-24} width={10} height={3} fill="#d9534f" />
    </g>
  );
};

// ---------------- street furniture ----------------
export const MarketStall: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x},${y})`}>
    {/* tent */}
    <rect x={-80} y={-150} width={4} height={150} fill="#6b6f75" />
    <rect x={76} y={-150} width={4} height={150} fill="#6b6f75" />
    <path d="M-92,-150 L0,-180 L92,-150 Z" fill="#f4efe6" />
    {Array.from({length: 8}).map((_, i) => (
      <path key={i} d={`M${-92 + i * 23},-150 l23,0 l0,16 q-11.5,8 -23,0 Z`} fill={i % 2 ? '#f4efe6' : '#4f8a7a'} />
    ))}
    {/* table */}
    <rect x={-74} y={-58} width={148} height={8} fill="#a0784f" />
    <rect x={-70} y={-50} width={140} height={50} fill="#d9c9a8" />
    <text x={0} y={-22} fontSize={15} textAnchor="middle" fill="#5a4630" fontFamily="Georgia, serif" fontWeight={700}>
      SOURDOUGH
    </text>
    {/* loaves */}
    {[-56, -30, -4, 22, 48].map((lx, i) => (
      <g key={i}>
        <ellipse cx={lx} cy={-66} rx={13} ry={9} fill={i % 2 ? '#c99256' : '#b98048'} />
        <path d={`M${lx - 6},-70 L${lx + 6},-64 M${lx - 7},-65 L${lx + 2},-60`} stroke="#e9cfa2" strokeWidth={1.6} />
      </g>
    ))}
    <ellipse cx={-42} cy={-80} rx={12} ry={8} fill="#c48b4f" />
    <ellipse cx={34} cy={-80} rx={12} ry={8} fill="#b98048" />
    {/* vendor */}
    <rect x={44} y={-112} width={22} height={40} rx={8} fill="#e07a5f" />
    <circle cx={55} cy={-122} r={10} fill="#d9a47c" />
    <path d="M45,-125 Q46,-136 56,-134 Q65,-133 65,-124 Z" fill="#2b211b" />
  </g>
);

export const CoffeeCart: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x},${y})`}>
    <path d="M-52,-108 L52,-108 L44,-92 L-44,-92 Z" fill="#c9733f" />
    <rect x={-2} y={-140} width={4} height={34} fill="#6b6f75" />
    <path d="M-50,-140 Q0,-170 50,-140 Z" fill="#f2cc8f" />
    <rect x={-46} y={-92} width={92} height={70} rx={6} fill="#3d5a80" />
    <rect x={-40} y={-84} width={80} height={20} rx={3} fill="#f4efe6" />
    <text x={0} y={-69} fontSize={14} textAnchor="middle" fill="#3d5a80" fontFamily="Arial, sans-serif" fontWeight={800}>
      COFFEE
    </text>
    <rect x={-28} y={-104} width={10} height={12} rx={2} fill="#fff" />
    <rect x={-14} y={-104} width={10} height={12} rx={2} fill="#fff" />
    <circle cx={-30} cy={-14} r={10} fill="#3c3f44" />
    <circle cx={30} cy={-14} r={10} fill="#3c3f44" />
  </g>
);

export const Storefront: React.FC<{x: number; y: number; w: number; h: number; color: string; sign: string; signColor?: string; awning?: string}> = ({
  x,
  y,
  w,
  h,
  color,
  sign,
  signColor = '#ffffff',
  awning,
}) => (
  <g>
    <rect x={x} y={y - h} width={w} height={h} fill={color} />
    <rect x={x} y={y - h} width={w} height={10} fill="#000" opacity={0.08} />
    {/* upper windows */}
    {Array.from({length: Math.max(2, Math.floor(w / 50))}).map((_, i, arr) => (
      <rect key={i} x={x + 14 + i * ((w - 28) / arr.length)} y={y - h + 22} width={(w - 28) / arr.length - 12} height={h * 0.25} fill={P.glass} opacity={0.85} />
    ))}
    {/* sign band */}
    <rect x={x + 10} y={y - h * 0.52} width={w - 20} height={26} rx={3} fill={signColor} />
    <text x={x + w / 2} y={y - h * 0.52 + 18} fontSize={15} textAnchor="middle" fill="#2f3b4c" fontFamily="Arial, sans-serif" fontWeight={800} letterSpacing={1}>
      {sign}
    </text>
    {awning && <path d={`M${x + 6},${y - h * 0.52 + 30} L${x + w - 6},${y - h * 0.52 + 30} L${x + w - 14},${y - h * 0.52 + 50} L${x + 14},${y - h * 0.52 + 50} Z`} fill={awning} />}
    {/* shop window + door */}
    <rect x={x + 14} y={y - h * 0.52 + 54} width={w * 0.55} height={h * 0.52 - 58} fill={P.glassLight} />
    <rect x={x + w * 0.66} y={y - h * 0.52 + 54} width={w * 0.22} height={h * 0.52 - 54} fill="#5f7286" />
  </g>
);

/** Abstract mural: original shapes only. */
export const MuralWall: React.FC<{x: number; y: number; w: number; h: number}> = ({x, y, w, h}) => (
  <g>
    <rect x={x} y={y - h} width={w} height={h} fill="#f0e2cc" />
    <clipPath id="mural-clip">
      <rect x={x + 10} y={y - h + 14} width={w - 20} height={h - 24} />
    </clipPath>
    <g clipPath="url(#mural-clip)">
      <rect x={x + 10} y={y - h + 14} width={w - 20} height={h - 24} fill="#3d5a80" />
      <circle cx={x + w * 0.22} cy={y - h * 0.55} r={h * 0.38} fill="#f2cc8f" />
      <circle cx={x + w * 0.22} cy={y - h * 0.55} r={h * 0.22} fill="#e07a5f" />
      <path d={`M${x},${y} Q${x + w * 0.35},${y - h * 0.9} ${x + w * 0.6},${y - h * 0.3} T${x + w},${y - h * 0.6} L${x + w},${y} Z`} fill="#81b29a" />
      <path d={`M${x + w * 0.45},${y - h} L${x + w * 0.75},${y - h * 0.15} L${x + w * 0.95},${y - h} Z`} fill="#e5989b" opacity={0.9} />
      {Array.from({length: 7}).map((_, i) => (
        <circle key={i} cx={x + w * 0.55 + i * 22} cy={y - h * 0.72 + (i % 2) * 18} r={7} fill="#f4efe6" />
      ))}
      <path d={`M${x + 10},${y - h * 0.25} Q${x + w * 0.3},${y - h * 0.05} ${x + w * 0.5},${y - h * 0.22}`} stroke="#f4efe6" strokeWidth={6} fill="none" />
    </g>
  </g>
);

export const Hills: React.FC<{x: number; y: number; w: number; color: string; seed?: number; amp?: number}> = ({x, y, w, color, seed = 3, amp = 60}) => {
  let d = `M${x},${y}`;
  const n = Math.ceil(w / 220);
  for (let i = 0; i <= n; i++) {
    const px = x + i * 220;
    const h = amp * (0.5 + 0.5 * Math.sin(i * 1.7 + seed));
    d += ` Q${px - 110},${y - h - amp * 0.6} ${px},${y - h * 0.5}`;
  }
  d += ` L${x + w},${y + 200} L${x},${y + 200} Z`;
  return <path d={d} fill={color} />;
};
