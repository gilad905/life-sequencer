(function () {
  const evolveCbx = document.querySelector("#evolve");
  const evolveEvery = document.querySelector("#evolve-every");
  let barCounter = 0;

  Tone.Transport.on("stop", () => {
    barCounter = 0;
  });

  ls.addStepAction((time, index) => {
    if (index == 0) {
      barCounter++;
      if (!evolveCbx.checked || barCounter == 1) {
        // don't evolve when just started
        return;
      }
    }

    const evolveInterval = parseInt(evolveEvery.value);
    if (evolveInterval > ls.sequencer._matrix.length) {
      // todo - evolve every n bars
      return;
    }
    const toEvolve = index % evolveInterval === 0;
    if (toEvolve) {
      console.debug(`evolving at ${barCounter}:${index}`);
      evolve();
    }
  }, 2);

  function evolve() {
    const matrix = ls.sequencer._matrix.map((row) => row.slice());

    for (let x = 0; x < matrix.length; x++) {
      for (let y = 0; y < matrix[x].length; y++) {
        const neighbors = countNeighbors(x, y);
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
