import React from 'react';
import {Composition, AbsoluteFill, useCurrentFrame} from 'remotion';
import {Character} from './Character';

const SetupTest: React.FC = () => (
  <AbsoluteFill style={{background: '#3b6e8f', justifyContent: 'center', alignItems: 'center'}}>
    <div style={{color: 'white', fontSize: 96, fontFamily: 'sans-serif', fontWeight: 700}}>Setup OK</div>
  </AbsoluteFill>
);

const CharacterTest: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#eef1f4'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 640, height: 2, background: '#cfd6de'}} />
      <Character frame={frame} x={640} groundY={640} scale={1.75} talking />
    </AbsoluteFill>
  );
};

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="SetupTest" component={SetupTest} durationInFrames={60} fps={30} width={1280} height={720} />
    <Composition id="CharacterTest" component={CharacterTest} durationInFrames={90} fps={30} width={1280} height={720} />
  </>
);
