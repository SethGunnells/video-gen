import React, { forwardRef, useContext, useMemo } from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, Easing } from 'remotion';

import { CodeScene as CodeSceneType, Dimensions, ViewSize } from '../types';

import { getSceneDimensions } from '../codeSceneUtils';

import Code from './Code';
import { SizeKeyContext } from '../CodeScenesComp';

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
  const frame = useCurrentFrame();
  const { height, width } = useVideoConfig();
  const sizeKey = useContext(SizeKeyContext);
  const padding = height / 8;
  const viewSize: ViewSize = { height, padding, width };

  if (!oldCode && !newCode)
    throw new Error('useSceneDimensions called with no code values');

  const now = useMemo(() => {
    return getSceneDimensions(
      (oldCode ? oldCode + '\n' : '') + newCode,
      sizeKey,
      viewSize
    );
  }, [height, width, sizeKey, oldCode, newCode]);

  const past = useMemo(() => {
    if (!oldCode) return now;
    return getSceneDimensions(oldCode, sizeKey, viewSize);
  }, [height, width, sizeKey, oldCode, now]);

  if (!newCode && oldCode) return past;

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
