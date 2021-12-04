import { DrawerHeader } from '@chakra-ui/react';
import React, { useEffect, useState, useRef } from 'react'

export default function Waveform(props) {

    const audioCtx = props.audioCtx
    const [imgurl, setImgurl] = useState()
    let duration = useRef()
    let interval = useRef()

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
        console.log('In generete wave func');
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


    const drawHead = (ctx, headPos) => {
        ctx.clearRect(0,0,1920,150)
        ctx.clearRect(0,0,1920,-150)
        ctx.strokeStyle = 'red'
        ctx.moveTo(headPos, 0)
        ctx.beginPath()
        ctx.lineTo(headPos, 150)
        ctx.lineTo(headPos, -150)
        ctx.stroke()
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
        canvas.style.backgroundImage = `url('${imgurl}')`
        canvas.style.backgroundColor = 'black'
        const ctx = canvas.getContext('2d')
        console.log(canvas.height);
        drawHead(ctx, 0)

    }, [imgurl])

    useEffect(() => {

        if(!props.isPlaying === undefined) return 

        if(!props.isPlaying === false){
            if(interval.current === null) return 
            clearInterval(interval.current)
        }

        if (props.isPlaying === true) {
            const canvas = document.getElementById('canvas')
            const ctx = canvas.getContext('2d')
            let headPos = 0
            interval = setInterval(() => {
                drawHead(ctx, headPos)
                headPos = headPos + canvas.width / (duration.current * 100)
            }, 10)
        }

    }, [props.isPlaying])

    //Wpx,Tms 1ms -> W/T



    return (
        <div>
            <h1>Waveform</h1>
            <canvas id='canvas' width="1920px" height="300px"></canvas>
        </div>
    )
}
