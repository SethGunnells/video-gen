import { RefObject } from 'react';

export interface Annotation {
  code: string;
  color?: string;
  frame: number;
  getNodes: (ref: RefObject<HTMLElement>) => HTMLElement[];
  inSpeed?: number;
  outSpeed?: number;
  padding?: number | [number, number] | [number, number, number, number];
  seed?: number;
  style?: 'circle' | 'highlight' | 'underline';
  type: 'annotation';
}

export interface CodeScene {
  frame: number;
  inSpeed?: number;
  newCode?: string;
  oldCode?: string;
  type: 'code';
}

export interface Dimensions {
  scale: number;
  x: number;
  y: number;
}

export type PartialAnnotation = Omit<Annotation, 'code'>;

export interface PartialCodeScene
  extends Pick<CodeScene, 'frame' | 'inSpeed' | 'type'> {
  code: string;
}

export interface SizeKey {
  height: number;
  width: number;
}

export interface ViewSize {
  height: number;
  padding: number;
  width: number;
}
