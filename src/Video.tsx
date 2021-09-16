import { Composition } from 'remotion';
import CodeScenesComp from './CodeScenesComp';
import IntroTest from './IntroTest';
import NotationTest from './NotationTest';

export const RemotionVideo: React.FC = () => {
  return (
    <>
      <Composition
        id="CodeScenesComp"
        component={CodeScenesComp}
        durationInFrames={800}
        fps={60}
        width={1920 * (process.env.NODE_ENV === 'development' ? 0.5 : 1)}
        height={1080 * (process.env.NODE_ENV === 'development' ? 0.5 : 1)}
      />
      <Composition
        id="IntroTest"
        component={IntroTest}
        durationInFrames={300}
        fps={60}
        width={1920}
        height={1080}
      />
      <Composition
        id="NotationTest"
        component={NotationTest}
        durationInFrames={300}
        fps={60}
        width={1920}
        height={1080}
      />
    </>
  );
};
