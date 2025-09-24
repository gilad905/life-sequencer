(function () {
  document.querySelector("#clear").addEventListener("click", clearSequencer);
  const logPattern = document.querySelector("#log-pattern");
  logPattern.addEventListener("click", logCurrentPattern);

  loadPattern(ls.patterns[Object.keys(ls.patterns)[1]]);
  initDropdown(ls.patterns);

  function initDropdown(patterns) {
    for (const patternName in patterns) {
      if (!ls.isDev && patternName.startsWith("tester_")) {
        continue;
      }
      const item = document.createElement("li");
      item.classList.add("dropdown-item");
      item.role = "button";
      item.textContent = patternName.replaceAll("_", " ");
      item.dataset.patternName = patternName;
      if (patternName == "clear") {
        item.classList.add("text-danger");
      }
      item.addEventListener("click", onPatternItemClick);
      document.querySelector("#patterns .dropdown-menu").appendChild(item);
    }
  }

  function onPatternItemClick(e) {
    clearSequencer();
    loadPattern(ls.patterns[e.target.dataset.patternName]);
    document.querySelector("#patterns .dropdown-toggle").innerHTML =
      e.target.textContent + "&nbsp;&nbsp;";
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

  window.ls ??= {};
  window.ls = { ...window.ls, loadPattern, clearSequencer };
})();
