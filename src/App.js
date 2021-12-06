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
      <h1 style={{marginBottom:20,textAlign:'center',fontWeight:'bold',fontSize:'40px'}}>Audio visualiser</h1>
      <h5 style={{marginBottom:20,textAlign:'center'}}>Use top right and left corners to trim the waveform</h5>
      <h5 style={{marginBottom:20,textAlign:'center'}}>Note : Trim audio only before or after playing the complete audio (i.e. when playehad is at the beginning)</h5>
      <AudioPlayer  source={source} audioEnded={audioEnded} setAudioEnded={setAudioEnded} isPlaying={isPlaying} setIsPlaying={setIsPlaying} audioCtx={audioCtx} audioSrc={audioSrc} setAudioSrc={setAudioSrc} />
      <Waveform source={source} setIsPlaying={setIsPlaying} audioEnded={audioEnded} setAudioEnded={setAudioEnded} isPlaying={isPlaying} setAudioSrc={setAudioSrc} audioSrc={audioSrc} audioCtx={audioCtx} />
    </div>
  )
}

