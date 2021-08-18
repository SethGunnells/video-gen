import { ReactNode } from 'react';
import { interpolate, Easing } from 'remotion';

import Code from './Code';

const { ease, inOut } = Easing;

export interface CodeScene {
  code: string;
  frame: number;
  transitionSpeed: number;
}

const getCurrentScene = (scenes: CodeScene[], frame: number): CodeScene =>
  scenes.reduce((result, scene) => (scene.frame <= frame ? scene : result));

export const getReferenceText = (
  scenes: CodeScene[],
  frame: number
): ReactNode => {
  const allShownScenes = scenes.filter(scene => scene.frame <= frame);
  const scenesForText =
    allShownScenes.length === 1
      ? allShownScenes
      : allShownScenes.filter(
          scene => frame > scene.frame + scene.transitionSpeed
        );
  return scenesForText.map(scene => <Code opacity={1}>{scene.code}</Code>);
};

const getOpacity = (scene: CodeScene, frame: number) =>
  interpolate(
    frame,
    scene.frame === 0
      ? [0, 30]
      : [0, scene.frame, scene.frame + scene.transitionSpeed],
    scene.frame === 0 ? [0, 1] : [1, 0, 1],
    {
      easing: inOut(ease),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    }
  );

export const getText = (scenes: CodeScene[], frame: number): ReactNode =>
  scenes.reduce<ReactNode[]>((result, scene) => {
    if (scene.frame <= frame)
      result.push(<Code opacity={getOpacity(scene, frame)}>{scene.code}</Code>);
    return result;
  }, []);

export const getTopOffset = (
  scenes: CodeScene[],
  frame: number,
  currentHeight: number,
  oldHeight: number
) => {
  const scene = getCurrentScene(scenes, frame);
  const startFrame = scene.frame;
  const endFrame = startFrame + scene.transitionSpeed;
  return interpolate(
    frame,
    [startFrame, endFrame],
    [oldHeight / 2, currentHeight / 2],
    {
      easing: Easing.inOut(Easing.ease),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    }
  );
};
