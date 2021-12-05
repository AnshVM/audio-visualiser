import React, { useEffect, useState, useRef } from 'react'
import { render } from 'react-dom'
import { Rnd } from 'react-rnd'

export default function Waveform(props) {

    const audioCtx = props.audioCtx
    const [imgurl, setImgurl] = useState()
    const [rndState, setRndState] = useState({ x: 0, y: 0, width: "1900px", height: "300px" })
    const [state, setState] = useState(0)
    let duration = useRef()
    let startTime = useRef()
    let pauseTime = useRef()
    let playhead = useRef()
    let audioBufferRef = useRef()
    let width = useRef()

    const pxtoint = (str) => (
        Number(str.substring(0, str.length - 2))
    )

    const drawLine = (ctx, currentx, height) => {
        ctx.beginPath();
        ctx.moveTo(currentx, 0)
        ctx.lineTo(currentx, 0 - height)
        ctx.moveTo(currentx, 0)
        ctx.lineTo(currentx, height)
        ctx.moveTo(currentx, 0)
        ctx.lineTo(++currentx, 0)
        ctx.stroke();
        return { currentx }
    }

    const reduceData = (data, canvas) => {
        const requiredLength = canvas.width
        const blockSize = Math.floor(data.length / requiredLength)
        let reducedData = []
        let blockSum = 0
        for (let i = 0; i < data.length; i++) {
            blockSum += Math.abs(data[i])
            if ((i + 1) % blockSize === 0) {
                reducedData.push(blockSum / blockSize)
                blockSum = 0
            }
        }
        return reducedData
    }

    const generateWaveform = (heights) => {
        const canvas = document.getElementById('canvas')
        heights = reduceData(heights, canvas)
        const ctx = canvas.getContext('2d')
        ctx.translate(0, 150)
        ctx.strokeStyle = 'white'
        let currentx = 0
        for (let i = 0; i < heights.length; i++) {
            const obj = drawLine(ctx, currentx, heights[i] * 200)
            currentx = obj.currentx
        }
        setImgurl(canvas.toDataURL())
        ctx.clearRect(0, 0, 1900, -150)
        ctx.clearRect(0, 0, 1900, 150)
    }

    const movePlayHead = () => {
        const playHead = document.getElementById('playHead')
        const transitionDuration = Math.floor(duration.current * 1000)
        console.log(duration.current)
        playHead.style.transition = `margin-left ${transitionDuration}ms linear`
        const marginLeft = rndState.width
        playHead.style.marginLeft = marginLeft
    }

    const handleResize = (e, direction, ref, delta, position) => {
        const audioBuffer = audioBufferRef.current

        const newWidth = pxtoint(ref.style.width)
        const initialWidth = pxtoint(rndState.width)

        const newDuration = (audioBuffer.duration * newWidth) / initialWidth
        const { numberOfChannels, sampleRate } = audioBuffer
        const length = newDuration * sampleRate

        let newBuffer = audioCtx.createBuffer(1, length, sampleRate)

        let nowBuffering = newBuffer.getChannelData(0)

        if (direction === 'left') {
            const startIndex = Math.floor((audioBuffer.length - 1) - (newWidth * (audioBuffer.length - 1) / initialWidth))
            const oldAudioBufferData = audioBuffer.getChannelData(0)
            for (let i = 0; i < length; i++) {
                nowBuffering[i] = oldAudioBufferData[i + startIndex]
            }
        }

        if (direction === 'right') {
            const oldAudioBufferData = audioBuffer.getChannelData(0)
            for (let i = 0; i < length; i++) {
                nowBuffering[i] = oldAudioBufferData[i]
            }
        }

        audioBufferRef.current = newBuffer

        let source = audioCtx.createBufferSource()
        console.log(audioBufferRef.current.getChannelData(0))
        source.buffer = audioBufferRef.current
        source.connect(audioCtx.destination)
        props.setAudioSrc(source)

        setRndState({
            width: ref.style.width,
            height: ref.style.height,
            ...position
        })
    }

    useEffect(() => {
        if (!props.audioSrc) return

        if (props.audioSrc instanceof AudioBufferSourceNode) {
            duration.current = props.audioSrc.buffer.duration
            audioBufferRef.current = props.audioSrc.buffer
            props.audioSrc.onended = () => {
                props.setAudioEnded(true)
            }
        }

        fetch(props.audioSrc)
            .then(res => res.arrayBuffer())
            .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                duration.current = audioBuffer.duration
                audioBufferRef.current = audioBuffer
                console.log(audioBuffer)
                generateWaveform(audioBuffer.getChannelData(0))
            })
    }, [props.audioSrc])

    useEffect(() => {
        if (!imgurl) return

        const canvas = document.getElementById('canvas')
        canvas.remove()
        const waveform = document.getElementById('waveform')
        waveform.style.backgroundImage = `url('${imgurl}')`

    }, [imgurl])


    useEffect(() => {

        if (props.isPlaying === false && window.getComputedStyle(playhead.current).getPropertyValue('margin-left') !== '0px') {
            console.log('here')
            const marginLeft = window.getComputedStyle(playhead.current).getPropertyValue('margin-left')
            playhead.current.style.transform = ""
            playhead.current.style.transition = ""
            playhead.current.style.marginLeft = marginLeft
            pauseTime.current = Date.now()
            duration.current = duration.current - (pauseTime.current / 1000 - startTime.current / 1000)
        }

        if (props.isPlaying === true) {
            props.setAudioEnded(false)
            startTime.current = Date.now()
            movePlayHead()
        }


    }, [props.isPlaying])


    useEffect(() => {
        if (props.audioEnded === true) {
            console.log('ended')
            props.setIsPlaying(false)
            playhead.current.style.transform = ""
            playhead.current.style.transition = ""
            playhead.current.style.marginLeft = '0'
            console.log(playhead.current.style.marginLeft)
            duration.current = audioBufferRef.current.duration
            console.log(duration.current)
        }
    }, [props.audioEnded])




    return (
        <div style={{marginTop:20,marginLeft:10}}>
            <h1 style={{color:'white'}}>Waveform</h1>

            <Rnd
                maxWidth={rndState.width}
                style={{ zIndex: 1, position: 'fixed' }}
                size={{ width: rndState.width, height: rndState.height }}
                position={{ x: rndState.x, y: rndState.y }}
                onDragStop={(e, d) => { setRndState({ x: d.x, y: d.y, height: rndState.height, width: rndState.width }) }}
                onResizeStop={handleResize}
                disableDragging={true}
                enableResizing={{ left: !props.isPlaying, right: !props.isPlaying }}
            >
                <div style={{ backgroundColor: "black" }}>
                    <div ref={playhead} style={{ width: '1px', height: '300px', backgroundColor: 'red', position: 'relative' }} id="playHead"></div>
                </div>
            </Rnd>

            <div id="waveform" style={{ width: 1900, height: 300, zIndex: 2, position: 'fixed' }}></div>

            <canvas id='canvas' width="1900px" height="300px"></canvas>

        </div>
    )
}


