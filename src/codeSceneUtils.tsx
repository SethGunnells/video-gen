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
  code: string,
  height: number,
  width: number,
  padding: number
) => {
  createFontSizeMap();
  const codeLines = code.split('\n');
  const { scale, ...elem } = calculateDimensions(
    height - padding * 2,
    width - padding * 2,
    codeLines
  );
  const position = calculatePosition(height, width, elem.height, elem.width);
  return { scale, ...position };
};
