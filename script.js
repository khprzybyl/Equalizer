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

const updateGrid = () => {
    requestAnimationFrame(updateGrid);
    analyser.getByteFrequencyData(dataArray);

    const columns = 10; 
    const rows = 10;
    const maxIntensity = 255;

    for (let i = 0; i < grid.children.length; i++) {
        grid.children[i].style.backgroundColor = 'rgba(0, 0, 0, 0)';
    }

    const dataPointsPerColumn = Math.floor(dataArray.length / columns);

    for (let i = 0; i < columns; i++) {
        let frequencySum = 0;
        let startIndex = i * dataPointsPerColumn;
        let endIndex = (i === columns - 1) ? dataArray.length : startIndex + dataPointsPerColumn;

        for (let j = startIndex; j < endIndex; j++) {
            frequencySum += dataArray[j];
        }

        let intensity = (frequencySum / (endIndex - startIndex)) / maxIntensity;
        let boxesToColor = Math.ceil(intensity * rows);

        for (let j = 0; j < rows; j++) {
            let boxIndex = (rows - 1 - j) * columns + i;
            if (j < boxesToColor) {

                let baseIntensity = intensity > 0 ? 1 : 0;
                
                let gradientEffect = (1 - (j / rows));
                let boxIntensity = baseIntensity * gradientEffect;
                
                grid.children[boxIndex].style.backgroundColor = `rgba(80, 124, 255, ${boxIntensity})`;
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