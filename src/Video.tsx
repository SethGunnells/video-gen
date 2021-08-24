import { Composition } from 'remotion';
import NotationTest from './NotationTest';
import CodeScenesComp from './CodeScenesComp';

export const RemotionVideo: React.FC = () => {
  return (
    <>
      <Composition
        id="NotationTest"
        component={NotationTest}
        durationInFrames={300}
        fps={60}
        width={1920}
        height={1080}
      />
      <Composition
        id="CodeScenesComp"
        component={CodeScenesComp}
        durationInFrames={300}
        fps={60}
        width={1920}
        height={1080}
      />
    </>
  );
};
