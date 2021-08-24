import { useEffect, useRef, useState } from 'react';
import { interpolate, random, useCurrentFrame, Easing } from 'remotion';
import { annotate } from '@sethgunnells/rough-notation';

const { ease, out } = Easing;

const NotationTest = () => {
  const frame = useCurrentFrame();
  const ref = useRef<HTMLDivElement | null>(null);
  const [annotation, setAnnotation] = useState(null);

  useEffect(() => {
    if (!ref.current || annotation !== null) return;
    const nodes: HTMLElement[] = Array.from(
      ref.current.querySelectorAll('span:nth-child(n+2)')
    );
    const a = annotate(nodes, {
      seed: random(61) * 2 ** 31 + 1,
      type: 'highlight',
      color: 'red',
      iterations: 1,
      roughness: 100
    });
    a.show();
    console.log(a);
    setAnnotation(a);
  }, [ref]);

  useEffect(() => {
    if (annotation === null) return;
    annotation.setPercentageDrawn(
      interpolate(frame, [60, 90, 260, 290], [0, 1, 1, 0], {
        easing: out(ease),
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp'
      })
    );
  }, [annotation, frame]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#eceff4',
        flex: 1,
        fontSize: 100,
        backgroundColor: '#2e3440'
      }}
    >
      <div ref={ref}>
        <span>This is a</span> <span>notation</span> <span>test</span>
      </div>
    </div>
  );
};

export default NotationTest;
