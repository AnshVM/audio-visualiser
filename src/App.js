import React,{useState} from 'react'
import AudioPlayer from './components/AudioPlayer'
import Waveform from './components/Waveform'

export default function App() {

  const [audioSrc,setAudioSrc] = useState(null)
  const audioCtx = new (window.AudioContext || window.webkitAudioContext())()
  const [isPlaying,setIsPlaying] = useState(false)

  return (
    <div>
      <h1>Audio visualiser</h1>
      <AudioPlayer isPlaying={isPlaying} setIsPlaying={setIsPlaying} audioCtx={audioCtx} audioSrc={audioSrc} setAudioSrc={setAudioSrc} />
      <Waveform isPlaying={isPlaying} audioSrc={audioSrc} audioCtx={audioCtx} />
    </div>
  )
}

