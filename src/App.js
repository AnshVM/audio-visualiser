import React,{useState} from 'react'
import AudioPlayer from './components/AudioPlayer'
import Waveform from './components/Waveform'

export default function App() {

  const [audioSrc,setAudioSrc] = useState(null)
  const audioCtx = new (window.AudioContext || window.webkitAudioContext())()

  return (
    <div>
      <h1>Audio visualiser</h1>
      <AudioPlayer audioCtx={audioCtx} audioSrc={audioSrc} setAudioSrc={setAudioSrc} />
      <Waveform audioSrc={audioSrc} audioCtx={audioCtx} />
    </div>
  )
}

