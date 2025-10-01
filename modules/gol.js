(function () {
  const evolveCbx = document.querySelector("#evolve");
  const evolveEvery = document.querySelector("#evolve-every");
  let barCounter = 0;
  let evolveSteps, evolveBars;

  Tone.getTransport().on("stop", () => {
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

    let toEvolve = false;
    if (evolveBars > 1) {
      toEvolve = index == 0 && barCounter % evolveBars === 0;
    } else {
      toEvolve = index % evolveSteps === 0;
    }

    if (toEvolve) {
      console.debug(`evolving at ${barCounter}:${index}`);
      evolve();
    }
  }, 2);

  function evolve() {
    const matrix = ls.sequencer._matrix.map((row) => row.slice());

    for (let x = 0; x < matrix.length; x++) {
      for (let y = 0; y < matrix[x].length; y++) {
        const neighbors = countNeighbors(x, y, 4);
        if (matrix[x][y]) {
          matrix[x][y] = neighbors === 2 || neighbors === 3;

          // // cell age:
          // const stayAlive = neighbors === 2 || neighbors === 3;
          // if (stayAlive) {
          //   if (matrix[x][y] === true) {
          //     matrix[x][y] = 2;
          //   } else {
          //     matrix[x][y]++;
          //   }
          // } else {
          //   matrix[x][y] = 0;
          // }
        } else {
          matrix[x][y] = neighbors === 3;
        }
      }
    }

    ls.sequencer._matrix = matrix;
    ls.sequencer.requestUpdate();
  }

  function countNeighbors(x, y, maxCount) {
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
          if (count == maxCount) {
            return count;
          }
        }
      }
    }
    return count;
  }

  function updateEvolveState() {
    evolveSteps = parseInt(evolveEvery.value);
    evolveBars = evolveSteps / ls.sequencer._matrix.length;
  }

  window.ls ??= {};
  window.ls.updateEvolveState = updateEvolveState;
})();
