import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Bench, Building, SalesforceTower, Cloud, FogBank, Lamp, Layer, P, Palm, PASTELS, Person, Seagull, Sidewalk, Sky, Skyline, Tree, Victorian} from './primitives';
import {BayBridge, CableCar, CoffeeCart, Dog, Ferry, FerryBuilding, GoldenGate, Hills, MarketStall, MuniBus, MuralWall, Sailboat, Storefront, Streetcar} from './landmarks';

/** Walking speed in px/s that matches the stride of the character at scale 1 (see PROGRESS.md). */
export const WALK = 195;
export const CHAR_X = 600;
export const GROUND_Y = 615;

export type SceneProps = {t: number; frame: number};

const Street: React.FC<{x: number; w: number; top: number; bottom: number; dash?: boolean}> = ({x, w, top, bottom, dash = true}) => (
  <g>
    <rect x={x} y={top} width={w} height={bottom - top} fill={P.street} />
    {dash &&
      Array.from({length: Math.ceil(w / 120)}).map((_, i) => (
        <rect key={i} x={x + i * 120} y={(top + bottom) / 2 - 2} width={60} height={4} fill={P.streetLine} opacity={0.8} />
      ))}
  </g>
);

// =====================================================================
// Scene 1: Ferry Building, Embarcadero — morning fog
// =====================================================================
export const Scene1: React.FC<SceneProps> = ({t, frame}) => {
  const far = 14 * t;
  const mid = 45 * t;
  const near = WALK * t;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Sky id="s1" top="#a9c5dc" bottom="#f6e1d1" sun={{x: 210, y: 240, r: 26, color: '#fff2da'}} />
      {/* far: bay, Bay Bridge, East Bay hills, ferry, fog */}
      <Layer offset={far}>
        <Hills x={-200} y={392} w={2600} color="#bccbd6" seed={2} amp={26} />
        <rect x={-200} y={392} width={2600} height={200} fill={P.water} />
        <Hills x={1250} y={398} w={500} color="#a9bcc9" seed={5} amp={30} />
        <BayBridge x={-120} y={378} w={1500} />
        <FogBank x={-100 + frame * 0.6} y={366} w={1100} h={34} o={0.75} seed={4} />
        <FogBank x={700 + frame * 0.4} y={350} w={900} h={30} o={0.6} seed={9} />
        {Array.from({length: 8}).map((_, i) => (
          <rect key={i} x={i * 260 + 40} y={430 + (i % 3) * 22} width={60} height={2} fill="#fff" opacity={0.45} />
        ))}
        <Ferry x={1360 - 12 * t} y={470} s={0.85} />
      </Layer>
      {/* mid: Ferry Building + Embarcadero roadway */}
      <Layer offset={mid}>
        <rect x={-200} y={516} width={2600} height={10} fill="#cfc6b8" />
        <FerryBuilding x={550} y={518} />
        {[300, 1400, 1700].map((x, i) => (
          <Palm key={i} x={x} y={520} s={0.75} frame={frame} />
        ))}
        <Street x={-200} w={2800} top={526} bottom={560} />
      </Layer>
      {/* near: promenade, palms, market stall, lamps */}
      <Layer offset={near}>
        <Sidewalk x={-400} w={5400} top={560} />
        {[200, 1500, 2900, 3800, 4500].map((x, i) => (
          <Palm key={`p${i}`} x={x} y={572} s={1.15} frame={frame + i * 20} />
        ))}
        {[750, 2350, 3400, 4300].map((x, i) => (
          <Lamp key={`l${i}`} x={x} y={572} />
        ))}
        <MarketStall x={1960} y={578} />
        <Person x={1860} y={590} seed={3} />
        <Person x={2085} y={588} seed={8} flip />
        <Bench x={1180} y={585} />
        <Person x={1170} y={585} seed={21} pose="sit" />
      </Layer>
      {/* seagulls */}
      <svg width={1280} height={720} style={{position: 'absolute', left: 0, top: 0}}>
        <Seagull x={180 + frame * 1.6} y={150 + Math.sin(frame * 0.03) * 10} frame={frame} />
        <Seagull x={240 + frame * 1.5} y={175} frame={frame} phase={1.4} s={0.8} />
        <Seagull x={980 - frame * 0.9} y={115} frame={frame} phase={2.2} s={0.9} />
        <Seagull x={1150 - frame * 0.7} y={210} frame={frame} phase={0.5} s={0.7} />
      </svg>
    </AbsoluteFill>
  );
};

// =====================================================================
// Scene 2: California Street cable car, Nob Hill — tilted uphill
// =====================================================================
export const SCENE2_TILT = -9;
export const Scene2: React.FC<SceneProps> = ({t, frame}) => {
  const far = 10 * t;
  const mid = 80 * t;
  const near = WALK * t;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Sky id="s2" top="#93c1e4" bottom="#e7f0f3" />
      <Layer offset={far}>
        <Cloud x={300} y={120} s={1.2} />
        <Cloud x={900} y={90} s={0.9} o={0.7} />
        <Cloud x={1500} y={140} s={1.1} />
        {/* distant view of the Bay down the hill (lower left) */}
        <Hills x={-200} y={372} w={2400} color="#a8bccb" seed={3} amp={30} />
        <rect x={-200} y={380} width={2400} height={400} fill={P.water} />
        {Array.from({length: 10}).map((_, i) => (
          <rect key={i} x={i * 230} y={400 + (i % 3) * 18} width={50} height={2} fill="#fff" opacity={0.5} />
        ))}
        <Sailboat x={1050} y={420} frame={frame} s={0.4} />
      </Layer>
      {/* the hill itself: mid + near rotated so the street climbs to the right */}
      <AbsoluteFill style={{transform: `rotate(${SCENE2_TILT}deg)`, transformOrigin: `${CHAR_X}px ${GROUND_Y}px`}}>
        <Layer offset={mid}>
          <rect x={-600} y={430} width={4000} height={800} fill="#c7c0b4" />
          <rect x={985} y={380} width={315} height={60} fill="#c7c0b4" />
          {Array.from({length: 16}).map((_, i) => {
            if (i === 9 || i === 10) return null; // cross street: view down to the Bay
            const body = ['#e6d3bf', '#cfdbe3', '#efdfc6', '#d8cbe0', '#dfe6cf', '#ead0c3'][i % 6];
            const trim = ['#fbf6ee', '#ffffff', '#f6efe2'][i % 3];
            const accent = ['#7a8fa6', '#a0675a', '#5f8a7a', '#8a6fa0'][i % 4];
            return <Victorian key={i} x={-500 + i * 165} y={435} w={150} h={230} body={body} trim={trim} accent={accent} />;
          })}
          {[-260, 400, 1060, 1720, 2380].map((x, i) => (
            <Tree key={i} x={x} y={442} s={0.75} />
          ))}
        </Layer>
        <Layer offset={near}>
          {/* street with cable-car tracks + center cable slot */}
          <rect x={-600} y={440} width={6200} height={92} fill={P.street} />
          {[465, 475, 505, 515].map((y) => (
            <rect key={y} x={-600} y={y} width={6200} height={3} fill="#a7aab0" />
          ))}
          <rect x={-600} y={489} width={6200} height={3} fill="#3e4247" />
          {Array.from({length: 50}).map((_, i) => (
            <rect key={i} x={-600 + i * 130} y={460} width={4} height={60} fill="#6a6f75" opacity={0.6} />
          ))}
          <Sidewalk x={-600} w={6200} top={532} />
          <CableCar x={60 + (WALK + 52) * t} y={526} frame={frame} s={0.95} />
          {[300, 1300, 2500, 3600].map((x, i) => (
            <Lamp key={i} x={x} y={544} />
          ))}
          <Person x={1650} y={572} seed={33} />
          <Person x={2700} y={570} seed={41} flip />
        </Layer>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// =====================================================================
// Scene 3: South Park, SoMa
// =====================================================================
export const Scene3: React.FC<SceneProps> = ({t, frame}) => {
  const far = 12 * t;
  const back = 35 * t;
  const mid = 75 * t;
  const near = WALK * t;
  const signs = ['LAUNCH LAB', 'SEED & CO.', 'DATA STUDIO', 'BYTE BAKERY', 'NORTHWIND', 'PIXEL WORKS', 'OPEN DESK'];
  const fronts = ['#e6cdb8', '#cdd9e2', '#efdcc0', '#d6d1e3', '#dbe5cf', '#ecd2c6', '#e2dccd'];
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Sky id="s3" top="#9fc7e6" bottom="#eef3f1" />
      <Layer offset={far}>
        <Cloud x={200} y={110} s={1} />
        <Cloud x={1050} y={80} s={1.2} o={0.75} />
        <Skyline x={-200} y={430} w={2200} seed={23} color="#c2cdd8" maxH={170} />
        <SalesforceTower x={940} y={430} h={360} color="#c9d3dd" />
      </Layer>
      <Layer offset={back}>
        {Array.from({length: 9}).map((_, i) => (
          <Storefront key={i} x={-120 + i * 230} y={470} w={210} h={200} color={fronts[i % fronts.length]} sign={signs[i % signs.length]} awning={i % 2 ? '#4f8a7a' : '#c9733f'} />
        ))}
        <rect x={-200} y={470} width={2600} height={14} fill="#cfc6b8" />
      </Layer>
      <Layer offset={mid}>
        {/* the oval lawn of South Park */}
        <ellipse cx={1150} cy={520} rx={1250} ry={46} fill={P.grass} />
        <ellipse cx={1150} cy={512} rx={1180} ry={26} fill="#a3cc82" />
        {[0, 330, 640, 980, 1330, 1690, 2050].map((x, i) => (
          <Tree key={i} x={x} y={520} s={1.05} color={i % 2 ? P.foliage : '#77ad62'} />
        ))}
        {[180, 820, 1500, 2200].map((x, i) => (
          <g key={`b${i}`}>
            <Bench x={x} y={536} s={0.9} />
            <Person x={x - 14} y={534} seed={50 + i} pose="sitLaptop" s={0.9} />
            {i % 2 === 0 && <Person x={x + 16} y={534} seed={60 + i} pose="sitLaptop" s={0.9} />}
          </g>
        ))}
        <Person x={1150} y={538} seed={71} pose="lie" s={0.9} />
        <rect x={-200} y={556} width={2800} height={10} fill="#cfc6b8" />
      </Layer>
      <Layer offset={near}>
        <Sidewalk x={-400} w={5400} top={562} />
        <CoffeeCart x={1500} y={588} />
        <Person x={1420} y={594} seed={88} />
        <Person x={1585} y={592} seed={92} flip />
        {[400, 2400, 3500].map((x, i) => (
          <Lamp key={i} x={x} y={574} />
        ))}
      </Layer>
      <svg width={1280} height={720} style={{position: 'absolute', left: 0, top: 0}}>
        <Seagull x={900 - frame * 0.5} y={150} frame={frame} s={0.6} />
      </svg>
    </AbsoluteFill>
  );
};

// =====================================================================
// Scene 4: Dolores Park, Mission District
// =====================================================================
export const Scene4: React.FC<SceneProps> = ({t, frame}) => {
  const far = 10 * t;
  const mid = 55 * t;
  const near = WALK * t;
  // J-Church streetcar crosses the park, moving left.
  const carX = 1700 - 150 * t;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Sky id="s4" top="#98c4e7" bottom="#f1f1e8" />
      <Layer offset={far}>
        <Cloud x={250} y={90} s={1.1} />
        <Cloud x={980} y={130} s={0.8} o={0.7} />
        <Skyline x={-100} y={380} w={2200} seed={41} color="#bfcad6" maxH={130} transamerica={520} salesforce={800} />
        <Hills x={-200} y={400} w={2400} color="#d5ccb8" seed={4} amp={10} />
        {/* Mission rooftops between park and downtown */}
        {Array.from({length: 26}).map((_, i) => (
          <rect key={i} x={-150 + i * 90} y={386 - ((i * 37) % 26)} width={80} height={40 + ((i * 37) % 26)} fill={PASTELS[i % PASTELS.length]} opacity={0.9} />
        ))}
      </Layer>
      <Layer offset={mid}>
        {/* the grassy slope, rising to the left */}
        <path d="M-300,420 Q500,410 1100,450 T2600,500 L2600,720 L-300,720 Z" fill={P.grass} />
        <path d="M-300,470 Q600,460 1200,500 T2600,540 L2600,720 L-300,720 Z" fill={P.grassDark} opacity={0.35} />
        {/* track + overhead wire for the J line */}
        <line x1={-300} y1={334} x2={2600} y2={334} stroke="#5d6570" strokeWidth={1} opacity={0.7} />
        <rect x={-300} y={432} width={2900} height={6} fill="#8d8f92" />
        <Streetcar x={carX} y={436} s={0.8} />
        {/* mural wall on a Mission building */}
        <MuralWall x={1120} y={436} w={420} h={170} />
        <Building x={1540} y={436} w={200} h={210} color="#e4d3c0" cols={4} rows={5} />
        {/* people on blankets */}
        {[
          [80, 488, '#e07a5f'],
          [430, 474, '#3d5a80'],
          [760, 486, '#f2cc8f'],
          [1100, 500, '#81b29a'],
          [1420, 512, '#e5989b'],
          [1800, 528, '#9c89b8'],
        ].map(([x, y, c], i) => (
          <g key={i}>
            <path d={`M${(x as number) - 40},${y} L${(x as number) + 40},${y} L${(x as number) + 50},${(y as number) + 14} L${(x as number) - 50},${(y as number) + 14} Z`} fill={c as string} />
            <Person x={(x as number) - 12} y={(y as number) + 8} seed={100 + i} pose="sit" s={0.85} />
            {i % 2 === 0 && <Person x={(x as number) + 16} y={(y as number) + 10} seed={120 + i} pose="lie" s={0.85} />}
          </g>
        ))}
        {[-120, 600, 1300, 2000].map((x, i) => (
          <Palm key={`p${i}`} x={x} y={470 + i * 10} s={0.85} frame={frame} />
        ))}
        <Tree x={300} y={470} s={0.9} />
        <Tree x={960} y={490} s={0.85} color="#77ad62" />
        <rect x={-300} y={548} width={2900} height={12} fill="#cfc6b8" />
      </Layer>
      <Layer offset={near}>
        <Sidewalk x={-400} w={5400} top={560} />
        {[350, 1500, 2700, 3700].map((x, i) => (
          <Palm key={i} x={x} y={572} s={1.2} frame={frame + i * 9} />
        ))}
        {[950, 2100, 3200].map((x, i) => (
          <Lamp key={`l${i}`} x={x} y={572} />
        ))}
        <Person x={1800} y={596} seed={140} />
      </Layer>
    </AbsoluteFill>
  );
};

// =====================================================================
// Scene 5: Alamo Square & the Painted Ladies
// =====================================================================
export const Scene5: React.FC<SceneProps> = ({t, frame}) => {
  const far = 8 * t;
  const mid = 30 * t;
  const grass = 90 * t;
  const near = WALK * t;
  const ladies = [
    ['#f2c9c2', '#ffffff', '#6f9fb3'],
    ['#cfe1ea', '#ffffff', '#c3707a'],
    ['#f6e3b3', '#ffffff', '#7f9a6f'],
    ['#d7e7d1', '#fffdf6', '#b07a9a'],
    ['#e8d4ea', '#ffffff', '#5f8fb0'],
    ['#fbe0c8', '#ffffff', '#8a6fa0'],
    ['#cddcf0', '#fffdf6', '#d08a5b'],
  ];
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Sky id="s5" top="#a2c6e3" bottom="#f7e8d4" sun={{x: 1120, y: 150, r: 24, color: '#fff3dc'}} />
      <Layer offset={far}>
        <Cloud x={200} y={120} s={1} o={0.8} />
        <Cloud x={760} y={80} s={1.3} o={0.7} />
        <Skyline x={-150} y={430} w={2000} seed={57} color="#bcc8d4" maxH={150} transamerica={760} salesforce={1080} />
      </Layer>
      <Layer offset={mid}>
        {/* Steiner Street rise: houses step up to the left */}
        <path d="M-300,420 L2600,470 L2600,720 L-300,720 Z" fill="#d4ccbf" />
        {ladies.map(([body, trim, accent], i) => {
          const x = 260 + i * 132;
          const base = 430 + i * 6;
          return <Victorian key={i} x={x} y={base} w={124} h={186} body={body} trim={trim} accent={accent} ornate />;
        })}
        {[110, 1230, 1400].map((x, i) => (
          <Victorian key={`o${i}`} x={x} y={420 + (x / 2900) * 50} w={120} h={170} body={['#d9d2c5', '#cfd6d9', '#ddd1c4'][i]} trim="#f4f1ea" />
        ))}
        {/* street + Muni bus + trolley wires */}
        <rect x={-300} y={466} width={2900} height={30} fill={P.street} />
        <line x1={-300} y1={372} x2={2600} y2={372} stroke="#4d5560" strokeWidth={1.2} />
        <line x1={-300} y1={378} x2={2600} y2={378} stroke="#4d5560" strokeWidth={1.2} />
        <MuniBus x={-200 + 120 * t} y={494} s={0.72} />
      </Layer>
      <Layer offset={grass}>
        {/* Alamo Square's lawn rolling down toward us */}
        <path d="M-300,500 Q400,486 900,500 T2200,498 T3200,506 L3200,720 L-300,720 Z" fill={P.grass} />
        {[100, 700, 1350, 2050, 2700].map((x, i) => (
          <Tree key={i} x={x} y={512} s={0.95} color={i % 2 ? P.foliage : '#77ad62'} />
        ))}
        <path d="M390,524 L490,524 L500,540 L380,540 Z" fill="#81b29a" />
        <Person x={420} y={534} seed={150} pose="sit" s={0.85} />
        <Person x={455} y={532} seed={151} pose="lie" s={0.85} />
        <path d="M1610,538 L1690,538 L1700,552 L1600,552 Z" fill="#f2cc8f" />
        <Person x={1650} y={546} seed={152} pose="sit" s={0.85} />
      </Layer>
      <Layer offset={near}>
        <rect x={-400} y={548} width={5400} height={26} fill={P.grassDark} />
        <Sidewalk x={-400} w={5400} top={568} color="#e3d9c6" />
        {[650, 2300, 3600].map((x, i) => (
          <Lamp key={i} x={x} y={580} />
        ))}
        <Bench x={1500} y={592} />
        {/* dog runs ahead of the walker on the grass */}
        <Dog x={-150 + (WALK + 120) * t} y={566} frame={frame} s={1.1} />
      </Layer>
    </AbsoluteFill>
  );
};

// =====================================================================
// Scene 6: Crissy Field & the Golden Gate Bridge — warm late light
// =====================================================================
export const Scene6: React.FC<SceneProps> = ({t, frame}) => {
  const far = 8 * t;
  const mid = 50 * t;
  const near = WALK * t;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Sky id="s6" top="#86acd2" bottom="#f8cf9c" sun={{x: 1060, y: 220, r: 30, color: '#ffe0a3'}} />
      <Layer offset={far}>
        {/* Marin Headlands with fog rolling over */}
        <Hills x={-200} y={410} w={2200} color="#9d9f86" seed={8} amp={70} />
        <FogBank x={-260 + frame * 0.5} y={330} w={1200} h={46} o={0.85} seed={14} color="#fdf3e6" />
        <FogBank x={500 + frame * 0.35} y={350} w={900} h={36} o={0.7} seed={19} color="#fdf3e6" />
        <rect x={-200} y={410} width={2400} height={300} fill="#7fa8c4" />
        {/* golden sheen on the water */}
        {Array.from({length: 12}).map((_, i) => (
          <rect key={i} x={980 + (i % 4) * 30 - i * 4} y={430 + i * 8} width={90 - i * 4} height={2} fill="#ffe3b0" opacity={0.6} />
        ))}
        <GoldenGate x={90} y={402} w={1180} />
        <Sailboat x={300 + 18 * t} y={474} frame={frame} s={0.9} />
        <Sailboat x={1140 - 6 * t} y={448} frame={frame + 20} s={0.55} />
      </Layer>
      <Layer offset={mid}>
        {/* beach + dune grass */}
        <path d="M-300,505 Q600,496 1400,506 T2800,504 L2800,560 L-300,560 Z" fill="#ead7b2" />
        {Array.from({length: 40}).map((_, i) => (
          <path key={i} d={`M${-200 + i * 70},${532 + (i % 3) * 6} q4,-18 8,0 q4,-14 8,0`} stroke="#9aa86b" strokeWidth={3} fill="none" />
        ))}
        <Person x={500} y={530} seed={160} s={0.75} />
        <Person x={1350} y={532} seed={161} s={0.75} flip />
      </Layer>
      <Layer offset={near}>
        <Sidewalk x={-400} w={5400} top={560} color="#e6d8bd" seam="#d6c6a7" curb="#cdbd9d" />
        {Array.from({length: 40}).map((_, i) => (
          <rect key={i} x={-300 + i * 140} y={548} width={6} height={30} fill="#8b6e52" />
        ))}
        <rect x={-400} y={556} width={5400} height={4} fill="#8b6e52" />
      </Layer>
      {/* warm wash */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(255,190,120,0.0), rgba(255,170,90,0.10))'}} />
      <svg width={1280} height={720} style={{position: 'absolute', left: 0, top: 0}}>
        <Seagull x={300 + frame * 0.8} y={180} frame={frame} s={0.7} />
      </svg>
    </AbsoluteFill>
  );
};

export const SCENES = [Scene1, Scene2, Scene3, Scene4, Scene5, Scene6];
