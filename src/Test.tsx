import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, Easing } from 'remotion';

import './styles.css';

import {
  getSceneDimensions,
  getShownScenes,
  getText,
  CodeScene
} from './codeSceneUtils';

const scenes: CodeScene[] = [
  {
    frame: 0,
    transitionSpeed: 30,
    code: "import _ from 'lodash'"
  },
  {
    frame: 100,
    transitionSpeed: 50,
    code: `
const character = {
  name: 'Seth',
  race: 'Elf',
  stats: {
    strength: 10,
    intelligence: 18,
    charisma: 12
  }
}`
  },
  {
    frame: 200,
    transitionSpeed: 30,
    code: `
_.get(character, 'stats.strength')`
  }
];

const Text: React.FC<{
  frame: number;
  padding: number;
}> = ({ frame, padding }) => {
  const { height, width } = useVideoConfig();
  const shownScenes = getShownScenes(scenes, frame);
  const { frame: start, transitionSpeed } = shownScenes[shownScenes.length - 1];
  const end = start + transitionSpeed;
  const pastScenes =
    shownScenes.length === 1 ? shownScenes : shownScenes.slice(0, -1);
  const past = getSceneDimensions(pastScenes, height, width, padding);
  const { fontSize, left, top } = getSceneDimensions(
    shownScenes,
    height,
    width,
    padding
  );

  return (
    <div
      style={{
        fontSize: interpolate(frame, [start, end], [past.fontSize, fontSize], {
          easing: Easing.inOut(Easing.ease),
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp'
        }),
        position: 'absolute',
        left: interpolate(frame, [start, end], [past.left, left], {
          easing: Easing.inOut(Easing.ease),
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp'
        }),
        top: interpolate(frame, [start, end], [past.top, top], {
          easing: Easing.inOut(Easing.ease),
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp'
        })
      }}
    >
      {getText(scenes, frame)}
    </div>
  );
};

const Test: React.FC = () => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();

  const padding = height / 8;

  return (
    <div style={{ flex: 1, backgroundColor: '#2e3440' }}>
      <Text frame={frame} padding={padding} />
    </div>
  );
};

export default Test;
