document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    createGrid();
});

let audioContext;
let analyser;
let dataArray;
let animationFrameId;

function setupEventListeners() {
    const audioInput = document.getElementById('audioUpload');
    const audio = document.getElementById('audio');
    
    audioInput.addEventListener('change', handleFileUpload);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
}

function handleFileUpload(e) {
    const file = e.target.files[0];
    const audio = document.getElementById('audio');
    if (file) {
        audio.src = URL.createObjectURL(file);
    }
}

function createGrid() {
    const grid = document.getElementById('grid');
    for (let i = 0; i < 100; i++) {
        let div = document.createElement('div');
        div.className = 'grid-box';
        grid.appendChild(div);
    }
}

function setupAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        const audio = document.getElementById('audio');
        const source = audioContext.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
    }
}

function updateGrid() {
    analyser.getByteFrequencyData(dataArray);
    const grid = document.getElementById('grid');
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

        for (let j = 0; j < boxesToColor; j++) {
            let boxIndex = (rows - 1 - j) * columns + i;
            let baseIntensity = intensity > 0 ? 1 : 0;
            let gradientEffect = (1 - (j / rows));
            let boxIntensity = baseIntensity * gradientEffect;
            grid.children[boxIndex].style.backgroundColor = `rgba(80, 124, 255, ${boxIntensity})`;
        }
    }
    
    animationFrameId = requestAnimationFrame(updateGrid);
}

function handlePlay() {
    setupAudio(); // Ensure audio is set up before playing
    audioContext.resume().then(() => {
        animationFrameId = requestAnimationFrame(updateGrid);
    });
}

function handlePause() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
}