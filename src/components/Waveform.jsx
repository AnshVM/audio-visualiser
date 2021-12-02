import React,{useEffect} from 'react'

export default function Waveform(props) {

    const audioCtx = props.audioCtx

    const visualise = (audioBuffer) => {
        console.log(audioBuffer.getChannelData(0))
    }

    useEffect(()=>{

        if(!props.audioSrc) return

        fetch(props.audioSrc)
        .then(res => res.arrayBuffer())
        .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer))
        .then(audioBuffer => visualise(audioBuffer))

    },[props.audioSrc])

    return (
        <div>
            <h1>Waveform</h1>
        </div>
    )
}
