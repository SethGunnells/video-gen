import React, { createContext, useEffect, useState } from 'react';
import { continueRender, delayRender, Sequence } from 'remotion';

import './styles.css';

import {
  Annotation as AnnotationType,
  CodeScene as CodeSceneType,
  SizeKey
} from './types';

import { buildCodeSceneData } from './codeSceneUtils';

import Annotation from './components/Annotation';
import CodeScene from './components/CodeScene';

const scenes: (CodeSceneType|AnnotationType)[] = buildCodeSceneData([
  { code: "import _ from 'lodash'", frame: 0, type: 'code' },
  { code: `
const character = {
  name: 'Seth',
  race: 'Elf',
  stats: {
    strength: 10,
    intelligence: 18,
    charisma: 12
  }
}`, frame: 200, type: 'code' },
  { frame: 400, getNodes: (ref) => Array.from(ref.current?.querySelectorAll('code > span:nth-child(n+11):nth-child(-n+13)') ?? []), style: 'highlight', type: 'annotation' },
  { frame: 600, code: "_.get(character, 'stats.intelligence')", type: 'code' }
])

// const scenes: (CodeSceneType|AnnotationType)[] = [
//   {
//     inSpeed: 30,
//     newCode: "import _ from 'lodash'",
//     type: 'code'
//   },
//   {
//     inSpeed: 50,
//     oldCode: `import _ from 'lodash'`,
//     newCode: `
// const character = {
//   name: 'Seth',
//   race: 'Elf',
//   stats: {
//     strength: 10,
//     intelligence: 18,
//     charisma: 12
//   }
// }`,
//     type: 'code'
//   },
//   {
//     code: `import _ from 'lodash'

// const character = {
//   name: 'Seth',
//   race: 'Elf',
//   stats: {
//     strength: 10,
//     intelligence: 18,
//     charisma: 12
//   }
// }`,
//     getNodes: (ref) => Array.from(ref.current?.querySelectorAll('code > span:nth-child(n+11):nth-child(-n+13)') ?? []),
//     style: 'highlight',
//     type: 'annotation'
//   },
//   {
//     inSpeed: 30,
//     oldCode: `import _ from 'lodash'

// const character = {
//   name: 'Seth',
//   race: 'Elf',
//   stats: {
//     strength: 10,
//     intelligence: 18,
//     charisma: 12
//   }
// }`,
//     newCode: `
// _.get(character, 'stats.strength')`,
//     type: 'code'
//   }
// ];

export const SizeKeyContext = createContext<SizeKey>({ height: -Infinity, width: -Infinity })

const CodeScenesComp: React.FC = () => {
  const [handle] = useState(() => delayRender())
  const [sizeKey, setSizeKey] = useState<{height: number, width: number}|null>(null)
  
  useEffect(() => {
    // @ts-ignore
    document.fonts.load('100px Fantasque Sans Mono').then(() => {
      const pre = document.createElement('pre');
      Object.assign(pre.style, {
        fontFamily: 'Fantasque Sans Mono',
        fontSize: '100px',
        opacity: '0',
        position: 'absolute'
      });
      pre.textContent = 'a';
      document.body.append(pre);
      const { height, width } = pre.getBoundingClientRect();
      pre.remove();

      continueRender(handle);
      setSizeKey({ height, width })
    })
  }, [])

  if (!sizeKey) return null

  return (
    <SizeKeyContext.Provider value={sizeKey}>
      <div style={{ flex: 1, backgroundColor: '#2e3440' }}>
        {scenes.map((scene, i) => (
          <Sequence key={i} from={scene.frame} durationInFrames={200} layout="none">
            { scene.type === 'annotation' ? <Annotation {...scene} /> : <CodeScene {...scene} /> }
          </Sequence>
        ))}
      </div>
    </SizeKeyContext.Provider>
  );
};

export default CodeScenesComp;
