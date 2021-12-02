import React, { useEffect } from 'react'

export default function Waveform(props) {

    const audioCtx = props.audioCtx

    const drawLine = (ctx,currentx,height) => {
        ctx.beginPath();
        ctx.moveTo(currentx,0)
        ctx.lineTo(currentx,0-height)
        ctx.moveTo(currentx,0)
        ctx.lineTo(currentx,height)
        ctx.moveTo(currentx,0)
        ctx.lineTo(++currentx,0)
        ctx.stroke();
        return {currentx}
    }

    const reduceData = (data,canvas) => {
        const requiredLength = canvas.width/2
        const blockSize = Math.floor(data.length/requiredLength)
        let reducedData = []
        let blockSum=0
        for(let i=0;i<data.length;i++){
            blockSum+=Math.abs(data[i])
            if((i+1)%blockSize===0){
                reducedData.push(blockSum/blockSize)
                blockSum=0
            }
        }
        console.log(reducedData);
        return reducedData
    }

    const generateWaveform = (heights) => {
        const canvas = document.getElementById('canvas')
        heights = reduceData(heights,canvas)
        const ctx = canvas.getContext('2d')
        ctx.translate(0,150)
        ctx.strokeStyle = 'white'
        let currentx=0
        for(let i=0;i<heights.length;i++){
            const obj = drawLine(ctx,currentx,heights[i]*100)
            currentx = obj.currentx
        }
    }


    useEffect(() => {
        if (!props.audioSrc) return
        fetch(props.audioSrc)
            .then(res => res.arrayBuffer())
            .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                console.log(audioBuffer)
                generateWaveform(audioBuffer.getChannelData(0))
            })
    }, [props.audioSrc])

    return (
        <div>
            <h1>Waveform</h1>
            <canvas id='canvas' width="1920px" height="300px" style={{ backgroundColor: 'black' }}></canvas>
        </div>
    )
}
