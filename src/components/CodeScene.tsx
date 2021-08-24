import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, Easing } from 'remotion';

import { Dimensions } from '../types';

import { getSceneDimensions } from '../codeSceneUtils';

import Code from './Code';

interface Props {
  introFrames: number;
  newCode: string;
  oldCode?: string;
}

const CodeScene: React.FC<Props> = ({ introFrames, newCode, oldCode }) => {
  const frame = useCurrentFrame();
  const { scale, x, y } = useSceneDimensions(oldCode, newCode, introFrames);
  const opacity = animate(frame, introFrames, [0, 1]);

  return (
    <div
      style={{
        fontSize: 100,
        position: 'absolute',
        transform: `translate(${x}px, ${y}px) scale(${scale})`,
        transformOrigin: 'top left'
      }}
    >
      {oldCode && <Code opacity={1}>{oldCode}</Code>}
      <Code opacity={opacity}>{newCode}</Code>
    </div>
  );
};

export default CodeScene;

/*********\
  HELPERS 
\*********/

const useSceneDimensions = (
  oldCode: string | undefined,
  newCode: string,
  frames: number
): Dimensions => {
  const frame = useCurrentFrame();
  const { height, width } = useVideoConfig();

  const now = getSceneDimensions(
    (oldCode ? oldCode + '\n' : '') + newCode,
    height,
    width,
    height / 8
  );
  const past = oldCode
    ? getSceneDimensions(oldCode, height, width, height / 8)
    : now;

  const scale = animate(frame, frames, [past.scale, now.scale]);
  const x = animate(frame, frames, [past.x, now.x]);
  const y = animate(frame, frames, [past.y, now.y]);

  return { scale, x, y };
};

const { out, ease } = Easing;
const animate = (frame: number, end: number, outRange: [number, number]) =>
  interpolate(frame, [0, end], outRange, {
    easing: out(ease),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });
