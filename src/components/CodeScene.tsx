import React, { forwardRef } from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, Easing } from 'remotion';

import { CodeScene as CodeSceneType, Dimensions } from '../types';

import { getSceneDimensions } from '../codeSceneUtils';

import Code from './Code';

type Props = CodeSceneType;

const CodeScene: React.ForwardRefRenderFunction<HTMLDivElement, Props> = (
  { inSpeed = null, newCode = null, oldCode = null },
  ref
) => {
  const frame = useCurrentFrame();
  const { scale, x, y } = useSceneDimensions(oldCode, newCode, inSpeed);
  const opacity = animate(frame, inSpeed, [0, 1]);

  return (
    <div
      ref={ref}
      style={{
        fontSize: 100,
        position: 'absolute',
        transform: `translate(${x}px, ${y}px) scale(${scale})`,
        transformOrigin: 'top left'
      }}
    >
      {oldCode && <Code opacity={1}>{oldCode}</Code>}
      {newCode && <Code opacity={opacity}>{newCode}</Code>}
    </div>
  );
};

export default forwardRef<HTMLDivElement, Props>(CodeScene);

/*********\
  HELPERS 
\*********/

const useSceneDimensions = (
  oldCode: string | null,
  newCode: string | null,
  frames: number | null
): Dimensions => {
  if (!oldCode && !newCode)
    throw new Error('useSceneDimensions called with no code values');

  const frame = useCurrentFrame();
  const { height, width } = useVideoConfig();

  if (!newCode && oldCode)
    return getSceneDimensions(oldCode, height, width, height / 8);

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
const animate = (
  frame: number,
  end: number | null,
  outRange: [number, number]
) =>
  end === null
    ? outRange[1]
    : interpolate(frame, [0, end], outRange, {
        easing: out(ease),
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp'
      });
