(function () {
  const evolve = document.querySelector("#evolve");
  const evolveEvery = document.querySelector("#evolve-every");

  const evolveLoop = new Tone.Loop(onEvolveTick);
  evolveLoop.interval = `0:0:${parseInt(evolveEvery.value) * 2}`;

  evolveEvery.addEventListener("change", (e) => {
    evolveLoop.interval = `0:0:${parseInt(e.target.value) * 2}`;
  });

  Tone.Transport.on("start", (time) => {
    evolveLoop.start(evolveLoop.interval);
  });
  Tone.Transport.on("stop", () => {
    evolveLoop.stop();
  });

  function onEvolveTick() {
    if (!evolve.checked) return;

    window.ls.applyModRow();
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
