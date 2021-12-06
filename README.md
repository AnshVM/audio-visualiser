# Audio Visualizer

### How is the waveform generated: 
The waveform is generated using the Web Audio API and Canvas.

Once the user chooses an audio file, the audio is converted to a buffer array and the data is extracted from it using AudioContext.decodeAudioData(). 
This data is then used to generate the waveform.

The problem is this data can be large (a 4 minute audio returns an array of length 1.6 crore).
**Trying to generate the waveform from such a large array takes time (the app also crashes in a few cases)** 
**To solve this, the array is passed through a function which reduces the data.**
Hence the array is divided in a number of blocks, where each block is represented by the average of the data points in that block.

        for (let i = 0; i < data.length; i++) {
            blockSum += Math.abs(data[i])
            if ((i + 1) % blockSize === 0) {
                reducedData.push(blockSum / blockSize)
                blockSum = 0
            }
        }
Once the data is reduced the waveform is generated using canvas.

### How does trimming work: 

Let's say the user trims the audio from the right. A new audio buffer will be created which copies data from the previous buffer starting from index 0 to the audio index till which the audio is trimmed. **This index is simply calculated using the ratio of old width and new width of the waveform.**

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

