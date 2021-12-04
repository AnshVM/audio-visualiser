import React, { useState, useRef, useEffect } from 'react'
import { Input, Button } from '@chakra-ui/react'

export default function AudioPlayer(props) {

    const audioElement = useRef(null)
    const {isPlaying,setIsPlaying,audioCtx} = props

    const handleFileInput = (e) => {
        props.setAudioSrc(URL.createObjectURL(e.target.files[0]))
    }

    const handlePausePlay = () => {

        if (audioCtx.state === "suspended") {
            audioCtx.resume()
        }

        if (!isPlaying) {
            audioElement.current.play()
        }
        if (isPlaying) {
            audioElement.current.pause()
        }

        setIsPlaying(!isPlaying)
    }

    useEffect(() => {
        if(!props.audioSrc) return
        const inputNode = audioCtx.createMediaElementSource(audioElement.current)
        inputNode.connect(audioCtx.destination)
    }, [props.audioSrc])

    return (
        <div>
            <input onChange={handleFileInput} type="file" />
            <audio ref={audioElement} src={props.audioSrc}></audio>
            <Button onClick={handlePausePlay} colorScheme="blue">{isPlaying ? "Pause" : "Play"}</Button>
        </div>
    )
}
