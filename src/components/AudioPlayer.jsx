import React, { useState, useRef, useEffect } from 'react'
import { Input, Button } from '@chakra-ui/react'

export default function AudioPlayer(props) {

    const audioElement = useRef(null)
    const { isPlaying, setIsPlaying, audioCtx } = props
    

    const handleFileInput = (e) => {
        if (audioCtx.state === "suspended") {
            audioCtx.resume()
        }
        props.setAudioSrc(URL.createObjectURL(e.target.files[0]))
    }

    const handlePausePlay = () => {
        if (props.audioSrc instanceof AudioBufferSourceNode) {
            if (!isPlaying) {
                try{
                    props.audioSrc.start()
                    setIsPlaying(true)
                    props.setAudioEnded(false)
                    props.audioSrc.onended = () => {
                        props.setAudioEnded(true)
                    }
                }catch(err){
                    if(err.name==='InvalidStateError'){
                        let source = audioCtx.createBufferSource()
                        source.buffer = props.audioSrc.buffer
                        source.connect(audioCtx.destination)
                        source.start()
                        setIsPlaying(true)
                        props.setAudioEnded(false)
                        source.onended = () => {
                            props.setAudioEnded(true)
                        }
                    } 
                }
            }
            return
            
        }

        if (!isPlaying) {
            audioElement.current.play()
        }

        if (isPlaying) {
            audioElement.current.pause()
        }

        setIsPlaying(!isPlaying)

    }

    const handleAudioEnd = () => {
        console.log('here1')
        props.setAudioEnded(true)
    }

    useEffect(() => {
        if (!props.audioSrc) return
        if (props.audioSrc instanceof AudioBufferSourceNode) return
        const inputNode = audioCtx.createMediaElementSource(audioElement.current)
        inputNode.connect(audioCtx.destination)
    }, [props.audioSrc])

    return (
        <div>
            <input onChange={handleFileInput} type="file" />
            <audio onEnded={handleAudioEnd} ref={audioElement} src={props.audioSrc}></audio>
            <Button onClick={handlePausePlay} colorScheme="blue">{isPlaying ? "Pause" : "Play"}</Button>
        </div>
    )
}
