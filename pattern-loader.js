(function () {
  document.querySelector("#clear").addEventListener("click", clearSequencer);
  document.querySelector("#log-pattern").addEventListener("click", logCurrentPattern);

  initSelect();
  loadPattern(patterns.acorn);

  function initSelect() {
    const select = document.querySelector("#patterns-select");
    for (const name in patterns) {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name.replaceAll("_", " ");
      document.querySelector("#patterns-select").appendChild(option);
    }

    select.addEventListener("change", (e) => {
      if (!e.target.value) return;
      clearSequencer();
      loadPattern(patterns[e.target.value]);
      e.target.value = "";
    });
  }

  function clearSequencer() {
    for (let y = 0; y < ls.sequencer._matrix.length; y++) {
      for (let x = 0; x < ls.sequencer._matrix[y].length; x++) {
        ls.sequencer._matrix[y][x] = false;
      }
    }
    ls.sequencer.requestUpdate();
  }

  async function loadPattern(pattern, startX = 0, startY = 0) {
    const rows = pattern
      .trim()
      .split("\n")
      .map((r) => r.trim());
    for (let y = 0; y < rows.length; y++) {
      for (let x = 0; x < rows[y].length; x++) {
        const { x: newX, y: newY } = ls.wrapAround(x + startX, y + startY);
        ls.sequencer._matrix[newX][newY] = rows[y][x] === "X";
      }
    }
    ls.sequencer.requestUpdate();
  }

  function logCurrentPattern() {
    const { _matrix } = ls.sequencer;
    const lines = [];
    for (let x = 0; x < _matrix[0].length; x++) {
      lines.push(_matrix.map((row) => (row[x] ? "X" : "_")).join(""));
    }
    console.log(lines.join("\n"));
  }
})();
