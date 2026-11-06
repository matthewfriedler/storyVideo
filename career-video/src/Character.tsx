import React from 'react';

/**
 * Matthew: flat-vector character, walking to the right, head in 3/4 view.
 * Separate parts (hair, head, torso, arms, legs, shoes) each in their own
 * <g> so the walk cycle can rotate them at the joints.
 *
 * Walk cycle: 8 key phases per stride, interpolated smoothly over
 * CYCLE_FRAMES frames (32 frames ≈ 1.07 s per full two-step stride).
 */
export const CYCLE_FRAMES = 32;

const C = {
  skin: '#f3cfb1',
  skinShade: '#e4b593',
  hair: '#4a3326',
  hairHi: '#5d4232',
  sweat: '#8b5e3c',
  sweatShade: '#7a5033',
  sweatFar: '#6c472d',
  rib: '#744c30',
  jeans: '#4d7cb5',
  jeansShade: '#41699a',
  jeansFar: '#3a5f8e',
  seam: '#365a86',
  shoe: '#fbfbfb',
  shoeFar: '#e6e8ec',
  sole: '#d4d8de',
  eye: '#2a2522',
  mouth: '#9a4b3c',
  brow: '#3d2a1f',
};

type Props = {
  frame: number;
  walking?: boolean;
  talking?: boolean;
};

const deg = (r: number) => (r * 180) / Math.PI;

const Leg: React.FC<{phase: number; far?: boolean}> = ({phase, far}) => {
  const s = Math.sin(phase);
  const c = Math.cos(phase);
  const hip = -21 * s; // negative = forward (facing right)
  const knee = 6 + 38 * Math.pow(Math.max(0, c), 1.6); // bends during swing
  const foot = -(hip + knee) * 0.9 + (c > 0 && s < 0 ? 18 * c * -s : 0); // toe-off tilt
  const jean = far ? C.jeansFar : C.jeans;
  const shade = far ? C.jeansFar : C.jeansShade;
  return (
    <g transform={`rotate(${hip})`}>
      <rect x={-12} y={-8} width={24} height={80} rx={12} fill={jean} />
      <rect x={4} y={4} width={3} height={62} rx={1.5} fill={shade} opacity={0.6} />
      <g transform={`translate(0,70) rotate(${knee})`}>
        <path d="M-11,-6 L11,-6 L11.5,62 L-11.5,62 Z" fill={jean} />
        <rect x={-11.5} y={58} width={23} height={5} fill={far ? C.jeansFar : C.seam} />
        <g transform={`translate(0,63) rotate(${foot})`}>
          <path
            d="M-12,-3 Q-14,8 -9,11 L25,11 Q30,11 29,5 Q27,-1 15,-3 L6,-5 Z"
            fill={far ? C.shoeFar : C.shoe}
            stroke="#c8ced6"
            strokeWidth={1}
          />
          <rect x={-11} y={8} width={39} height={4} rx={2} fill={C.sole} />
          <path d="M4,-2 L12,2" stroke="#c8ced6" strokeWidth={1.4} strokeLinecap="round" />
        </g>
      </g>
    </g>
  );
};

const Arm: React.FC<{phase: number; far?: boolean}> = ({phase, far}) => {
  const s = Math.sin(phase);
  const shoulder = 20 * s; // positive = hand goes back
  const elbow = -(10 + 22 * Math.max(0, -s)); // bend forward when arm swings forward
  const fill = far ? C.sweatFar : C.sweat;
  return (
    <g transform={`rotate(${shoulder})`}>
      <rect x={-9.5} y={-8} width={19} height={56} rx={9.5} fill={fill} stroke={far ? 'none' : C.sweatShade} strokeWidth={2} />
      {!far && <path d="M5,0 L5,40" stroke={C.sweatShade} strokeWidth={3} strokeLinecap="round" opacity={0.7} />}
      <g transform={`translate(0,46) rotate(${elbow})`}>
        <rect x={-8.5} y={-6} width={17} height={42} rx={8} fill={fill} stroke={far ? 'none' : C.sweatShade} strokeWidth={2} />
        <rect x={-8.5} y={30} width={17} height={7} rx={3} fill={far ? C.sweatFar : C.rib} />
        <ellipse cx={1} cy={44} rx={7} ry={8} fill={far ? C.skinShade : C.skin} />
      </g>
    </g>
  );
};

const Head: React.FC<{frame: number; talking: boolean}> = ({frame, talking}) => {
  // Blink: every ~3.4 s, 4 frames, with slight jitter between blinks.
  const blinkPeriod = 102;
  const local = (frame + 37) % blinkPeriod;
  const blink = local < 4 ? [0.55, 0.1, 0.1, 0.55][local] : 1;
  // Mouth: layered sines → natural-ish flapping while talking.
  const m = talking
    ? Math.max(0, 0.5 * Math.abs(Math.sin(frame * 0.85)) + 0.35 * Math.abs(Math.sin(frame * 0.37 + 1.3)) - 0.1)
    : 0;
  return (
    <g>
      {/* back hair volume */}
      <path d="M-22,-6 Q-26,-30 -2,-31 Q20,-32 24,-12 L22,-4 Q10,-14 -4,-12 Q-12,-10 -14,0 L-16,10 Q-23,6 -22,-6 Z" fill={C.hair} />
      {/* face */}
      <path d="M-17,-8 Q-18,22 2,27 Q14,29 21,18 Q25,10 24,-2 Q24,-20 4,-22 Q-16,-22 -17,-8 Z" fill={C.skin} />
      {/* jaw shade */}
      <path d="M-15,8 Q-12,24 2,27 Q-6,22 -9,8 Z" fill={C.skinShade} opacity={0.6} />
      {/* ear */}
      <ellipse cx={-11} cy={3} rx={5} ry={7} fill={C.skin} />
      <path d="M-12,0 Q-9,3 -12,7" stroke={C.skinShade} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      {/* hair top: short, side part, little front lift */}
      <path
        d="M-19,-6 Q-21,-27 0,-29 Q20,-30 25,-14 Q26,-6 23,-4 Q20,-14 10,-15 Q2,-16 -4,-12 Q-10,-9 -11,-3 Q-15,-8 -19,-6 Z"
        fill={C.hair}
      />
      <path d="M2,-27 Q14,-27 20,-19" stroke={C.hairHi} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      {/* sideburn */}
      <path d="M-11,-6 L-7,-6 L-7,4 L-10,4 Z" fill={C.hair} />
      {/* brows */}
      <path d="M3,-9 Q7,-11 11,-9.5" stroke={C.brow} strokeWidth={2} fill="none" strokeLinecap="round" />
      <path d="M15,-9.5 Q18.5,-11 21.5,-9" stroke={C.brow} strokeWidth={1.8} fill="none" strokeLinecap="round" />
      {/* eyes */}
      <g transform={`translate(7.5,-3) scale(1,${blink})`}>
        <ellipse rx={2.4} ry={2.9} fill={C.eye} />
        <circle cx={0.8} cy={-0.9} r={0.8} fill="#fff" />
      </g>
      <g transform={`translate(18.5,-3) scale(1,${blink})`}>
        <ellipse rx={2.1} ry={2.7} fill={C.eye} />
        <circle cx={0.7} cy={-0.9} r={0.7} fill="#fff" />
      </g>
      {/* nose */}
      <path d="M22,0 Q26,6 22,8" stroke={C.skinShade} strokeWidth={2} fill="none" strokeLinecap="round" />
      {/* cheek */}
      <ellipse cx={5} cy={9} rx={4} ry={2.4} fill="#eaa48b" opacity={0.35} />
      {/* mouth: friendly smile; opens a little while talking */}
      {m > 0.06 ? (
        <path
          d={`M8,14 Q14,${15 + 1} 19,13.5 Q16,${14 + 5 * m + 2} 13,${14 + 5 * m + 2} Q9.5,${14 + 4 * m + 1} 8,14 Z`}
          fill={C.mouth}
        />
      ) : (
        <path d="M8,13.5 Q13.5,18 19,13" stroke={C.mouth} strokeWidth={2} fill="none" strokeLinecap="round" />
      )}
    </g>
  );
};

/** Character in local coordinates: hip joint at (0,0), soles at y≈+145. */
export const CharacterSVG: React.FC<Props> = ({frame, walking = true, talking = false}) => {
  const phase = walking ? (2 * Math.PI * frame) / CYCLE_FRAMES : 0;
  const s = Math.sin(phase);
  const bob = walking ? 2.6 * Math.abs(s) - 1.3 : 0; // lowest at full stride
  const headNod = walking ? 0.8 * Math.sin(2 * phase) : 0;
  return (
    <g>
      {/* ground shadow (doesn't bob) */}
      <ellipse cx={6} cy={147} rx={46} ry={6} fill="#000" opacity={0.13} />
      <g transform={`translate(0,${bob})`}>
        {/* far arm (behind body) */}
        <g transform="translate(-2,-94)">
          <Arm phase={phase + Math.PI} far />
        </g>
        {/* legs */}
        <g transform="translate(-2,0)">
          <Leg phase={phase + Math.PI} far />
        </g>
        <g transform="translate(3,0)">
          <Leg phase={phase} />
        </g>
        {/* neck */}
        <rect x={-1} y={-122} width={13} height={22} rx={4} fill={C.skinShade} />
        {/* torso: brown crewneck sweatshirt */}
        <path d="M-22,10 L-25,-58 Q-27,-98 -6,-106 L12,-106 Q30,-100 28,-66 L27,10 Z" fill={C.sweat} />
        <path d="M18,-100 Q30,-92 28,-66 L27,10 L19,10 Q22,-40 18,-100 Z" fill={C.sweatShade} opacity={0.55} />
        <rect x={-23} y={2} width={51} height={11} rx={4} fill={C.rib} />
        <path d="M-6,-106 Q5,-99 14,-106" stroke={C.rib} strokeWidth={5} fill="none" strokeLinecap="round" />
        {/* head */}
        <g transform={`translate(4,${-142 + headNod}) rotate(${deg(0.02 * s)})`}>
          <Head frame={frame} talking={talking} />
        </g>
        {/* near arm (in front) */}
        <g transform="translate(4,-94)">
          <Arm phase={phase} />
        </g>
      </g>
    </g>
  );
};

/** Convenience wrapper: absolute-positioned SVG with the character's feet at (x, groundY). */
export const Character: React.FC<Props & {x: number; groundY: number; scale?: number}> = ({x, groundY, scale = 1, ...rest}) => {
  const w = 200;
  const h = 360;
  return (
    <svg
      width={w * scale}
      height={h * scale}
      viewBox={`-100 -200 ${w} ${h}`}
      style={{position: 'absolute', left: x - (w * scale) / 2, top: groundY - 147 * scale - 200 * scale + 0}}
    >
      <CharacterSVG {...rest} />
    </svg>
  );
};
