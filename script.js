document.addEventListener('DOMContentLoaded', () => {
    const audioInput = document.getElementById('audioUpload');
    const audio = document.getElementById('audio');

    audioInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            audio.src = URL.createObjectURL(file);
         }
    });

       for (let i = 0; i < 100; i++) {
        let div = document.createElement('div');
        div.className = 'grid-box';
        grid.appendChild(div);
    }

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let analyser = audioContext.createAnalyser();
    let source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 256;
    let bufferLength = analyser.frequencyBinCount;
    let dataArray = new Uint8Array(bufferLength);

    const updateGrid = ()=> {
        requestAnimationFrame(updateGrid);
        analyser.getByteFrequencyData(dataArray);

        const columns = 10; 
        const rows = 10;

        for (let i = 0; i < grid.children.length; i++) {
            grid.children[i].style.backgroundColor = 'rgba(0, 225, 0, 0)';
        }

        let midIndex = Math.floor(dataArray.length / 2);
        let quarterIndex = Math.floor(dataArray.length / 4);

        for (let i = 0; i < columns; i++) {
            let frequencySum = 0;
            let totalSamples = 0;
            
            let startIndex = midIndex + (i - columns / 2) * (quarterIndex / 2);
            let endIndex = startIndex + (quarterIndex / 3); 
            
            startIndex = Math.max(0, startIndex);
            endIndex = Math.min(dataArray.length, endIndex);

            for (let j = startIndex; j < endIndex; j++) {
                frequencySum += dataArray[j];
                totalSamples++;
            }
    
            let intensity = totalSamples > 0 ? (frequencySum / totalSamples) / 255 : 0;
            
            for (let j = 0; j < rows; j++) {
                let boxIndex = (rows - 1 - j) * columns + i;
                if (j / rows < intensity) { 
                    grid.children[boxIndex].style.backgroundColor = `rgb(80, 124, 255, ${intensity})`;
                }
            }
        }
    }

    audio.onplay = function () {
        audioContext.resume().then(() => {
            updateGrid();
        });
    };
});