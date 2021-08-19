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

export const createFontSizeMap = () => {
  const div = document.createElement('div');
  div.style.fontFamily = 'Fantasque Sans Mono';
  div.style.position = 'absolute';
  div.style.opacity = '0';
  div.textContent = 'a';
  document.body.appendChild(div);

  if (Object.keys(FONT_SIZE_MAP).length > 0) {
    div.style.fontSize = '200px';
    const px200 = FONT_SIZE_MAP[200];
    if (div.offsetHeight === px200.h && div.offsetWidth === px200.w) {
      document.body.removeChild(div);
      return;
    }
  }

  for (let px = 10; px <= 200; px++) {
    div.style.fontSize = `${px}px`;
    FONT_SIZE_MAP[px] = { h: div.offsetHeight, w: div.offsetWidth };
  }

  document.body.removeChild(div);
  console.log(FONT_SIZE_MAP);
};

const getCurrentScene = (scenes: CodeScene[], frame: number): CodeScene =>
  scenes.reduce((result, scene) => (scene.frame <= frame ? scene : result));

const getCurrentSceneIndex = (scenes: CodeScene[], frame: number): number =>
  scenes.reduce(
    (result, scene, i) => (scene.frame <= frame || result < 0 ? i : result),
    -1
  );

export const getFutureText = (scenes: CodeScene[], frame: number) => {
  const i = getCurrentSceneIndex(scenes, frame);
  const text = getText(scenes, frame);
  if (i === scenes.length - 1) return text;
  const nextScene = scenes[i + 1];
  return (
    <>
      {text}
      <Code opacity={1}>{nextScene.code}</Code>
    </>
  );
};

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
  return { fontSize: px, height: calcH(), width: calcW() };
};

const calculatePosition = (
  viewHeight: number,
  viewWidth: number,
  elemHeight: number,
  elemWidth: number
) => {
  return {
    left: viewWidth / 2 - elemWidth / 2,
    top: viewHeight / 2 - elemHeight / 2
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
  const { fontSize, ...elem } = calculateDimensions(
    height - padding * 2,
    width - padding * 2,
    codeLines
  );
  const position = calculatePosition(height, width, elem.height, elem.width);
  return { fontSize, ...position };
};

export const getShownScenes = (scenes: CodeScene[], frame: number) =>
  scenes.filter(scene => scene.frame <= frame);

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
