(function () {
  new Tone.Loop(onTick, "2n").start("2n");
  const sequencer = document.querySelector("tone-step-sequencer");

  function onTick() {
    const matrix = sequencer._matrix.map((row) => row.slice());

    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[y].length; x++) {
        const neighbors = countNeighbors(x, y);
        // console.log(x, y, neighbors);
        if (matrix[y][x]) {
          // Cell is alive
          matrix[y][x] = neighbors === 2 || neighbors === 3;
        } else {
          // Cell is dead
          matrix[y][x] = neighbors === 3;
        }
      }
    }

    sequencer._matrix = matrix;
    sequencer.requestUpdate();
  }

  function countNeighbors(x, y) {
    const { _matrix } = sequencer;
    let count = 0;
    for (let cY = y - 1; cY <= y + 1; cY++) {
      for (let cX = x - 1; cX <= x + 1; cX++) {
        if (cY === y && cX === x) continue; // Skip the cell itself
        if (
          cY >= 0 &&
          cY < _matrix.length &&
          cX >= 0 &&
          cX < _matrix[0].length
        ) {
          if (_matrix[cY][cX]) {
            count++;
          }
        }
      }
    }
    return count;
  }
})();
