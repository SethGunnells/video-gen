import { RefObject } from 'react';

export interface Annotation {
  code: string;
  color?: string;
  getNodes: (ref: RefObject<HTMLElement>) => HTMLElement[];
  inSpeed?: number;
  outSpeed?: number;
  padding?: number | [number, number] | [number, number, number, number];
  seed?: number;
  type?: 'circle' | 'highlight' | 'underline';
}

export interface CodeScene {
  inSpeed?: number;
  newCode?: string;
  oldCode?: string;
}

export interface Dimensions {
  scale: number;
  x: number;
  y: number;
}
