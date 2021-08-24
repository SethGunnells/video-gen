export interface CodeScene {
  code: string;
  frame: number;
  transitionSpeed: number;
}

export interface Dimensions {
  scale: number;
  x: number;
  y: number;
}

export interface Highlight extends CodeScene {
  type: 'undeline' | 'circle' | 'highlight';
  outFrame: number;
  outSpeed: number;
}
