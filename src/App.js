import React,{useState,useRef} from 'react'
import AudioPlayer from './components/AudioPlayer'
import Waveform from './components/Waveform'

export default function App() {

  const [audioSrc,setAudioSrc] = useState(null)
  const audioCtx = new (window.AudioContext || window.webkitAudioContext())()
  const [isPlaying,setIsPlaying] = useState(false)
  const [audioEnded,setAudioEnded] = useState(false)
  let source

  return (
    <div>
      <h1>Audio visualiser</h1>
      <AudioPlayer source={source} audioEnded={audioEnded} setAudioEnded={setAudioEnded} isPlaying={isPlaying} setIsPlaying={setIsPlaying} audioCtx={audioCtx} audioSrc={audioSrc} setAudioSrc={setAudioSrc} />
      <Waveform source={source} setIsPlaying={setIsPlaying} audioEnded={audioEnded} setAudioEnded={setAudioEnded} isPlaying={isPlaying} setAudioSrc={setAudioSrc} audioSrc={audioSrc} audioCtx={audioCtx} />
    </div>
  )
}

