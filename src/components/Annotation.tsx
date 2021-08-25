import React, { useEffect, useRef, useState } from 'react';
import {
  interpolate,
  interpolateColors,
  random,
  useCurrentFrame,
  useVideoConfig,
  Easing
} from 'remotion';
import { annotate } from '@sethgunnells/rough-notation';

import { Annotation as AnnotationType } from '../types';

import CodeScene from './CodeScene';

type Props = AnnotationType;

const Annotation: React.FC<Props> = ({
  code,
  color = '#5e81ac',
  getNodes,
  inSpeed = 30,
  outSpeed = 30,
  padding = 5,
  seed = 0,
  type = 'underline'
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [annotation, setAnnotation] = useState<any>(null);
  const [colors, setColors] = useState<string[]>([]);
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  useEffect(() => {
    if (!ref.current) return;

    const elems: HTMLElement[] = getNodes(ref);
    if (elems.length === 0) return;

    if (type === 'highlight')
      setColors(elems.map(e => e.style.color || '#eceff4'));

    const a = annotate(elems, {
      color,
      host: ref.current.parentElement,
      iterations: type === 'highlight' ? 1 : 2,
      padding,
      seed: random(seed) * 2 ** 21 + 1,
      type
    });

    a.show();
    setAnnotation(a);

    return () => {
      a.remove();
    };
  }, []);

  useEffect(() => {
    if (!annotation || !ref.current) return;

    const elems: HTMLElement[] = getNodes(ref);
    if (elems.length === 0) return;

    const startOutroFrame = durationInFrames - outSpeed - 10;

    if (type === 'highlight' && colors.length > 0)
      elems.forEach(
        (e, i) =>
          (e.style.color = interpolateColors(
            frame,
            [0, inSpeed, startOutroFrame, startOutroFrame + outSpeed],
            [colors[i], '#eceff4', '#eceff4', colors[i]]
          ))
      );

    annotation.setPercentageDrawn(
      interpolate(
        frame,
        [0, inSpeed, startOutroFrame, startOutroFrame + outSpeed],
        [0, 1, 1, 0],
        {
          easing: out(ease),
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp'
        }
      )
    );
  }, [annotation, colors, frame]);

  return <CodeScene oldCode={code} ref={ref} />;
};

export default Annotation;

/***********\
 * HELPERS *
\***********/

const { ease, out } = Easing;
