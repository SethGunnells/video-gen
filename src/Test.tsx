import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, Easing } from 'remotion';

import './styles.css';

import {
  getAnimatedDimensions,
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
  const { scale, x, y } = getAnimatedDimensions(
    scenes,
    frame,
    height,
    width,
    padding
  );

  return (
    <div
      style={{
        fontSize: 100,
        position: 'absolute',
        transformOrigin: 'top left',
        transform: `translate(${x}px, ${y}px) scale(${scale})`
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
