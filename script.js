document.addEventListener('DOMContentLoaded', function () {
    const audioInput = document.getElementById('audioUpload');
    const audio = document.getElementById('audio');
    const grid = document.getElementById('grid');

    for (let i = 0; i < 100; i++) {
        let div = document.createElement('div');
        div.className = 'grid-box';
        grid.appendChild(div);
    }

  audioInput.addEventListener('change', function (e) {
      const file = e.target.files[0];
      if (file) {
          audio.src = URL.createObjectURL(file);
          audio.load(); 
          audio.play(); 
      }
  });

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let analyser = audioContext.createAnalyser();
    let source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 256;
    let bufferLength = analyser.frequencyBinCount;
    let dataArray = new Uint8Array(bufferLength);

  function updateGrid() {
    requestAnimationFrame(updateGrid);
    analyser.getByteFrequencyData(dataArray);

    let columns = 10; 
    let rows = 10; 
    let dataPointsPerColumn = dataArray.length / columns;

    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
  
            let boxIndex = (rows - 1 - j) * columns + i; 
            let dataValueIndex = Math.floor(i * dataPointsPerColumn + j * dataPointsPerColumn / rows);
            
          
            if (dataValueIndex < dataArray.length) {
                let intensity = dataArray[dataValueIndex] / 255;
                let box = grid.children[boxIndex];
                box.style.opacity = intensity;
                box.style.backgroundColor = `rgba(0, 255, 0, ${intensity})`;
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