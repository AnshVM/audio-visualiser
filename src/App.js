import React,{useState} from 'react'
import AudioPlayer from './components/AudioPlayer'

export default function App() {

  const [audioSrc,setAudioSrc] = useState(null)

  return (
    <div>
      <h1>Audio visualiser</h1>
      <AudioPlayer audioSrc={audioSrc} setAudioSrc={setAudioSrc} />
    </div>
  )
}

