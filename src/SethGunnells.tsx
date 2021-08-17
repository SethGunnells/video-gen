import React, { useRef } from 'react'
import { interpolate, useCurrentFrame, useVideoConfig, Easing } from 'remotion'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { nord } from 'react-syntax-highlighter/dist/esm/styles/hljs'

const Code = ({ children, opacity }) => (
  <SyntaxHighlighter language="javascript" style={nord} customStyle={{ background: 'none', fontSize: 40, margin: 0, padding: 0, opacity }}>
    {children}
  </SyntaxHighlighter>
)

const getOpacity = (frame: number, start: number) => interpolate(
  frame,
  start === 0 ? [0, 30] : [0, start, start + 30],
  start === 0 ? [0, 1] : [1, 0, 1],
  {
    easing: Easing.inOut(Easing.ease),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  }
)

const offsetInterpolate = (frame, start: number, old: number, current: number) => interpolate(
  frame,
  [start, start + 30],
  [old / 2, current / 2],
  {
    easing: Easing.inOut(Easing.ease),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  }
)

const getPreviousStep = (frame: number) => {
  if (frame <= 130) return 0
  return 100
}

const getText = (frame: number, opacity?: number) => {
  const text = [
    <Code opacity={getOpacity(frame, 0)}>
      {"const foo = 'a string'\nconst fn = () => null"}
    </Code>
  ]

  if (frame >= 100) {
    text.push(<Code opacity={getOpacity(frame, 100)}>{"\nconst bar = 101"}</Code>)
  }

  if (frame >= 200) {
    text.push(<Code opacity={getOpacity(frame, 200)}>{"const baz = false"}</Code>)
  }

  return text
}

const getTopOffset = (frame: number, old: number, current: number) => {
  if (frame >= 100 && frame < 200) return offsetInterpolate(frame, 100, old, current)
  if (frame >= 200 && frame <= 230) return offsetInterpolate(frame, 200, old, current)
  return current / 2
}

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
      {getText(getPreviousStep(frame), 1)}
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
  const top = (vh / 2) - getTopOffset(frame, oldHeight, currentHeight)
  return (
    <div ref={ref} style={{
      position: 'absolute',
      top, 
      left: margin,
      width: vw - margin * 2
    }}>
      {getText(frame)}
    </div>
  )
}

const SethGunells: React.FC = () => {
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

export default SethGunells

