(function () {
  const metronome = document.querySelector("#metronome");
  const evolve = document.querySelector("#evolve");
  const evolveEvery = document.querySelector("#evolve-every");
  let tickCounter = 0;

  const metronomeSynth = new Tone.Synth({
    envelope: { release: 0.01 },
    volume: ls.defaultVolume,
  }).toDestination();

  new Tone.Loop(onMetronomeTick, "2n").start(0);
  const loop = new Tone.Loop(onTick);
  loop.interval = `0:0:${parseInt(evolveEvery.value) * 2}`;

  evolveEvery.addEventListener("change", (e) => {
    loop.interval = `0:0:${parseInt(e.target.value) * 2}`;
  });

  Tone.Transport.on("start", (time) => {
    loop.start(loop.interval);
  });
  Tone.Transport.on("stop", () => {
    loop.stop();
    tickCounter = 0;
  });

  function onMetronomeTick(time) {
    if (metronome.checked) {
      const octave = 6 + (tickCounter % 4 == 0 ? 1 : 0);
      metronomeSynth.triggerAttackRelease(`C${octave}`, "16t", time);
    }
    tickCounter++;
  }

  function onTick() {
    if (!evolve.checked) return;
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
