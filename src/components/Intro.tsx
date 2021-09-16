import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, Easing } from 'remotion';

const ease = Easing.out(Easing.ease);

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const opacity = interpolate(frame, [0, durationInFrames * 0.6], [0, 1], {
    easing: ease,
    extrapolateRight: 'clamp'
  });

  const scale = interpolate(frame, [0, durationInFrames * 0.8], [0.95, 1], {
    easing: ease,
    extrapolateRight: 'clamp'
  });

  const y = interpolate(frame, [0, durationInFrames * 0.8], [10, 0], {
    easing: ease,
    extrapolateRight: 'clamp'
  });

  return (
    <h1
      style={{
        fontFamily: 'Urbanist',
        fontWeight: 100,
        opacity,
        transform: `translateY(${y}px) scale(${scale})`
      }}
    >
      Code Concepts
    </h1>
  );
};

export default Intro;
