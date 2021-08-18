import React, { useRef } from 'react'
import { interpolate, useCurrentFrame, useVideoConfig, Easing } from 'remotion'

import './styles.css'

import { getReferenceText, getText, getTopOffset, CodeScene } from './codeSceneUtils'

const scenes: CodeScene[] = [
  { frame: 0, transitionSpeed: 30, code: "const foo = 'a string'\nconst fn = () => null" },
  { frame: 100, transitionSpeed: 30, code: "\nconst bar = 101" },
  { frame: 200, transitionSpeed: 30, code: "const baz = false" }
]

const Reference: React.FC<{
  frame: number,
  margin: number,
  innerRef: React.MutableRefObject<HTMLDivElement|null>,
  vw: number
}> = ({ frame, margin, innerRef, vw }) => {
  return (
    <div ref={innerRef} style={{
      position: 'absolute',
      opacity: 0,
      width: vw - margin * 2
    }}>
      {getReferenceText(scenes, frame)}
    </div>
  )
}

const Text: React.FC<{
  frame: number,
  margin: number,
  oldHeight: number,
  vh: number,
  vw: number
}> = ({ frame, margin, oldHeight, vh, vw }) => {
  const ref: React.MutableRefObject<HTMLDivElement|null> = useRef(null)
  const currentHeight = ref.current?.offsetHeight || -1
  const top = (vh / 2) - getTopOffset(scenes, frame, currentHeight, oldHeight)
  return (
    <div ref={ref} style={{
      position: 'absolute',
      top, 
      left: margin,
      width: vw - margin * 2
    }}>
      {getText(scenes, frame)}
    </div>
  )
}

const Test: React.FC = () => {
  const frame = useCurrentFrame()
  const { height: vh, width: vw } = useVideoConfig()

  const ref: React.MutableRefObject<HTMLDivElement|null> = useRef(null)
  const oldHeight = ref.current?.offsetHeight || -1

  const margin = vh / 10

  return (
    <div style={{ flex: 1, backgroundColor: '#2e3440' }}>
      <Reference
        frame={frame}
        margin={margin}
        innerRef={ref}
        vw={vw}
      />
      <Text
        frame={frame}
        margin={margin}
        oldHeight={oldHeight}
        vh={vh}
        vw={vw}
      />
    </div>
  )
}

export default Test

