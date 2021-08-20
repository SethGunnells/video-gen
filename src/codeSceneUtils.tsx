import { ReactNode } from 'react';
import { interpolate, Easing } from 'remotion';

import Code from './Code';

const { ease, inOut } = Easing;

export interface CodeScene {
  code: string;
  frame: number;
  transitionSpeed: number;
}

const FONT_SIZE_MAP: { [key: number]: { h: number; w: number } } = {};

const createFontSizeMap = () => {
  const div = document.createElement('div');
  div.style.fontFamily = 'Fantasque Sans Mono';
  div.style.position = 'absolute';
  div.style.opacity = '0';
  div.textContent = 'a';
  document.body.appendChild(div);

  if (Object.keys(FONT_SIZE_MAP).length > 0) {
    div.style.fontSize = '100px';
    const px100 = FONT_SIZE_MAP[100];
    if (div.offsetHeight === px100.h && div.offsetWidth === px100.w) {
      document.body.removeChild(div);
      return;
    }
  }

  for (let px = 10; px <= 100; px++) {
    div.style.fontSize = `${px}px`;
    FONT_SIZE_MAP[px] = { h: div.offsetHeight, w: div.offsetWidth };
  }

  document.body.removeChild(div);
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

export const getAnimatedDimensions = (
  scenes: CodeScene[],
  frame: number,
  height: number,
  width: number,
  padding: number
) => {
  const shown = getShownScenes(scenes, frame);
  const { frame: start, transitionSpeed } = shown[shown.length - 1];
  const end = start + transitionSpeed;
  const pastScenes = shown.length === 1 ? shown : shown.slice(0, -1);
  const past = getSceneDimensions(pastScenes, height, width, padding);
  const now = getSceneDimensions(shown, height, width, padding);

  const int = (prop: 'scale' | 'x' | 'y') =>
    interpolate(frame, [start, end], [past[prop], now[prop]], {
      easing: inOut(ease),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    });

  return {
    scale: int('scale'),
    x: int('x'),
    y: int('y')
  };
};

const getRawCodeLines = (scenes: CodeScene[]): string[] =>
  scenes.reduce<string[]>(
    (result, scene) => result.concat(scene.code.split('\n')),
    []
  );

const calculateDimensions = (
  maxHeight: number,
  maxWidth: number,
  lines: string[]
) => {
  const widestLineLength = lines.reduce(
    (result, line) => (line.length > result ? line.length : result),
    0
  );

  let px = 100;
  const calcH = () => FONT_SIZE_MAP[px].h * lines.length;
  const calcW = () => FONT_SIZE_MAP[px].w * widestLineLength;
  while (calcH() > maxHeight || calcW() > maxWidth) px--;
  return { scale: px / 100, height: calcH(), width: calcW() };
};

const calculatePosition = (
  viewHeight: number,
  viewWidth: number,
  elemHeight: number,
  elemWidth: number
) => {
  return {
    x: viewWidth / 2 - elemWidth / 2,
    y: viewHeight / 2 - elemHeight / 2
  };
};

export const getSceneDimensions = (
  scenes: CodeScene[],
  height: number,
  width: number,
  padding: number
) => {
  createFontSizeMap();
  const codeLines = getRawCodeLines(scenes);
  const { scale, ...elem } = calculateDimensions(
    height - padding * 2,
    width - padding * 2,
    codeLines
  );
  const position = calculatePosition(height, width, elem.height, elem.width);
  return { scale, ...position };
};

export const getShownScenes = (scenes: CodeScene[], frame: number) =>
  scenes.filter(scene => scene.frame <= frame);

export const getText = (scenes: CodeScene[], frame: number): ReactNode =>
  getShownScenes(scenes, frame).map(scene => (
    <Code opacity={getOpacity(scene, frame)}>{scene.code}</Code>
  ));
