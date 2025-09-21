(function () {
  const metronome = document.querySelector("#metronome");

  const metronomeSynth = new Tone.Synth({
    envelope: { release: 0.01 },
    volume: ls.defaultVolume,
  }).toDestination();
  let tickCounter = 0;

  Tone.Transport.on("start", (time) => hitMetronome(time));
  Tone.Transport.on("stop", (time) => (tickCounter = 0));

  new Tone.Loop(onTick, "2n").start("2n");

  function hitMetronome(time) {
    if (metronome.checked) {
      const octave = 6 + (tickCounter % 4 == 0 ? 1 : 0);
      metronomeSynth.triggerAttackRelease(`C${octave}`, "16t", time);
    }
  }

  function onTick(time) {
    tickCounter++;
    hitMetronome(time);

    const matrix = ls.sequencer._matrix.map((row) => row.slice());

    for (let x = 0; x < matrix.length; x++) {
      for (let y = 0; y < matrix[x].length; y++) {
        const neighbors = countNeighbors(x, y);
        // if (neighbors > 0) {
        //   console.log(`Cell (${x},${y}) has ${neighbors} neighbors`);
        // }
        if (matrix[x][y]) {
          // Cell is alive
          matrix[x][y] = neighbors === 2 || neighbors === 3;
        } else {
          // Cell is dead
          matrix[x][y] = neighbors === 3;
        }
      }
    }

    ls.sequencer._matrix = matrix;
    ls.sequencer.requestUpdate();
  }

  function countNeighbors(x, y) {
    const { _matrix } = ls.sequencer;
    let count = 0;
    for (let cX = -1; cX <= 1; cX++) {
      for (let cY = -1; cY <= 1; cY++) {
        if (cY === 0 && cX === 0) continue; // Skip the cell itself
        const { x: newX, y: newY } = ls.wrapAround(x + cX, y + cY);
        if (newY < 0) newY += _matrix[0].length;
        else if (newY >= _matrix[0].length) newY -= _matrix[0].length;
        if (_matrix[newX][newY]) {
          count++;
        }
      }
    }
    return count;
  }
})();
