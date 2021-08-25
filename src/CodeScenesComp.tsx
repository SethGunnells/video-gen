import React from 'react';
import { Sequence } from 'remotion';

import './styles.css';

import {
  Annotation as AnnotationType,
  CodeScene as CodeSceneType
} from './types';

import Annotation from './components/Annotation';
import CodeScene from './components/CodeScene';

const scenes: CodeSceneType[] = [
  {
    inSpeed: 30,
    newCode: "import _ from 'lodash'"
  },
  {
    inSpeed: 50,
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
    inSpeed: 30,
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

const a: AnnotationType = {
  code: `import _ from 'lodash'

const character = {
  name: 'Seth',
  race: 'Elf',
  stats: {
    strength: 10,
    intelligence: 18,
    charisma: 12
  }
}

_.get(character, 'stats.strength')`,
  getNodes: ref =>
    Array.from(
      ref.current?.querySelectorAll(
        'code > span:nth-child(n+29):nth-child(-n+31)'
      ) ?? []
    ),
};

const CodeScenesComp: React.FC = () => {
  return (
    <div style={{ flex: 1, backgroundColor: '#2e3440' }}>
      {scenes.map((scene, i) => (
        <Sequence key={i} from={i * 100} durationInFrames={100} layout="none">
          <CodeScene {...scene} />
        </Sequence>
      ))}
      <Sequence from={300} durationInFrames={Infinity} layout="none">
        <Annotation {...a} />
      </Sequence>
    </div>
  );
};

export default CodeScenesComp;
