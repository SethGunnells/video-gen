import { Dimensions, SizeKey, ViewSize } from './types';

const calculatePosition = (
  viewSize: ViewSize,
  elemHeight: number,
  elemWidth: number
) => {
  return {
    x: viewSize.width / 2 - elemWidth / 2,
    y: viewSize.height / 2 - elemHeight / 2
  };
};

const calculateSize = (
  code: string,
  sizeKey: SizeKey,
  viewSize: ViewSize
): { height: number; scale: number; width: number } => {
  const maxHeight = viewSize.height - viewSize.padding * 2;
  const maxWidth = viewSize.width - viewSize.padding * 2;

  const lines = code.split('\n');
  const height = lines.length * sizeKey.height;
  const width = lines.reduce((max, line) => {
    const width = line.length * sizeKey.width;
    return width > max ? width : max;
  }, -Infinity);

  const fitHeight = maxHeight / height;
  const fitWidth = maxWidth / width;
  const scale = [fitHeight, fitWidth, 1].reduce((min, n) =>
    n < min ? n : min
  );
  return { height: height * scale, scale, width: width * scale };
};

export const getSceneDimensions = (
  code: string,
  sizeKey: SizeKey,
  viewSize: ViewSize
): Dimensions => {
  const { height, scale, width } = calculateSize(code, sizeKey, viewSize);
  const position = calculatePosition(viewSize, height, width);
  return { scale, ...position };
};
