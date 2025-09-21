(function () {
  const metronome = document.querySelector("#metronome");
  const sequencer = document.querySelector("tone-step-sequencer");
  const metronomeSynth = new Tone.MembraneSynth().toDestination();

  // loadPattern(patterns.glider);
  for (let i = 0; i < 10; i++) {
    loadPattern(patterns.glider, i * 4, i * 4);
  }

  new Tone.Loop(onTick, "2n").start("2n");
  // hitMetronome(Tone.now());

  function hitMetronome(time) {
    if (metronome.checked) {
      metronomeSynth.triggerAttackRelease("C4", "16t", time);
    }
  }

  function onTick(time) {
    hitMetronome(time);

    const matrix = sequencer._matrix.map((row) => row.slice());

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

    sequencer._matrix = matrix;
    sequencer.requestUpdate();
  }

  function countNeighbors(x, y) {
    const { _matrix } = sequencer;
    let count = 0;
    for (let cX = -1; cX <= 1; cX++) {
      for (let cY = -1; cY <= 1; cY++) {
        if (cY === 0 && cX === 0) continue; // Skip the cell itself
        const { x: newX, y: newY } = wrapAround(x + cX, y + cY);
        if (newY < 0) newY += _matrix[0].length;
        else if (newY >= _matrix[0].length) newY -= _matrix[0].length;
        if (_matrix[newX][newY]) {
          count++;
        }
      }
    }
    return count;
  }

  async function loadPattern(pattern, startX = 0, startY = 0) {
    const { _matrix } = sequencer;
    const rows = pattern
      .trim()
      .split("\n")
      .map((r) => r.trim());
    for (let y = 0; y < rows.length; y++) {
      for (let x = 0; x < rows[y].length; x++) {
        const { x: newX, y: newY } = wrapAround(x + startX, y + startY);
        _matrix[newX][newY] = rows[y][x] === "X";
      }
    }
    sequencer.requestUpdate();
  }

  function wrapAround(x, y) {
    const { _matrix } = sequencer;
    while (x < 0) x += _matrix.length;
    while (x >= _matrix.length) x -= _matrix.length;
    while (y < 0) y += _matrix[0].length;
    while (y >= _matrix[0].length) y -= _matrix[0].length;
    return { x, y };
  }
})();
