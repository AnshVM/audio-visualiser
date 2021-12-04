import { DrawerHeader } from '@chakra-ui/react';
import React, { useEffect, useState, useRef } from 'react'

export default function Waveform(props) {

    const audioCtx = props.audioCtx
    const [imgurl, setImgurl] = useState()
    let duration = useRef()
    let startTime = useRef()
    let pauseTime = useRef()
    let playhead = useRef()


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
        ctx.clearRect(0, 0, 1920, -150)
        ctx.clearRect(0, 0, 1920, 150)
    }

    const movePlayHead = () => {
        const playHead = document.getElementById('playHead')
        const transitionDuration = Math.floor(duration.current*1000)
        playHead.style.transition = `margin-left ${transitionDuration}ms linear`
        const marginLeft = 1920 - Number(playhead.current.style.marginLeft[0,playhead.current.style.marginLeft.length-3])
        
        playHead.style.marginLeft = `${marginLeft}px`
    }

    useEffect(() => {
        if (!props.audioSrc) return
        fetch(props.audioSrc)
            .then(res => res.arrayBuffer())
            .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                duration.current = audioBuffer.duration
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

        if(props.isPlaying === false) {
            const marginLeft = window.getComputedStyle(playhead.current).getPropertyValue('margin-left')
            playhead.current.style.transform = ""
            playhead.current.style.transition = ""     
            playhead.current.style.marginLeft = marginLeft
            pauseTime.current = Date.now()
            duration.current = duration.current - (pauseTime.current/1000 - startTime.current/1000)
        }

        if(props.isPlaying === true) {
            startTime.current = Date.now()
            movePlayHead()
        }

    }, [props.isPlaying])


    return (
        <div>
            <h1>Waveform</h1>
            <div style={{backgroundColor:"black",width:'1920px',height:'300px'}} id="waveform">
                <div ref={playhead} style={{width:'1px',height:'300px',backgroundColor:'red'}} id="playHead"></div>
            </div>
            <canvas id='canvas' width="1920px" height="300px"></canvas>

        </div>
    )
}
