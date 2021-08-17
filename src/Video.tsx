import { Composition } from 'remotion';
import SethGunnells from './SethGunnells.tsx'

export const RemotionVideo: React.FC = () => {
	return (
		<>
			<Composition
				id="SethGunnells"
				component={SethGunnells}
				durationInFrames={300}
				fps={60}
				width={1920}
				height={1080}
			/>
		</>
	);
};
