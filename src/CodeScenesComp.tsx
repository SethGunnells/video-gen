import React from 'react';
import { Sequence } from 'remotion';

import './styles.css';

import CodeScene from './components/CodeScene';

interface CodeSceneType {
  introFrames: number;
  newCode: string;
  oldCode?: string;
}

const scenes: CodeSceneType[] = [
  {
    introFrames: 30,
    newCode: "import _ from 'lodash'"
  },
  {
    introFrames: 50,
    oldCode: `import _ from 'lodash'`,
    newCode: `
const character = {
  name: 'Seth',
  race: 'Elf',
  stats: {
    strength: 10,
    intelligence: 18,
    charisma: 12
  }
}`
  },
  {
    introFrames: 30,
    oldCode: `import _ from 'lodash'

const character = {
  name: 'Seth',
  race: 'Elf',
  stats: {
    strength: 10,
    intelligence: 18,
    charisma: 12
  }
}`,
    newCode: `
_.get(character, 'stats.strength')`
  }
];

const CodeScenesComp: React.FC = () => {
  return (
    <div style={{ flex: 1, backgroundColor: '#2e3440' }}>
      {scenes.map((scene, i) => (
        <Sequence key={i} from={i * 100} durationInFrames={100} layout="none">
          <CodeScene {...scene} />
        </Sequence>
      ))}
    </div>
  );
};

export default CodeScenesComp;
