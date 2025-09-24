(function () {
  initControls();
  addSequencerClasses();
  injectSequencerStyle();

  // if (ls.isDev) {
  //   ls.clearSequencer();
  //   ls.loadPattern(ls.patterns.diagonal_line);
  //   // const bpm = document.querySelector("#bpm");
  //   // bpm.value = 60;
  //   // updateBpm();
  //   const evolve = document.querySelector("#evolve");
  //   evolve.checked = false;
  // }

  function addSequencerClasses() {
    const { shadowRoot } = ls.sequencer;
    function addRowClasses(row, className) {
      const cells = shadowRoot.querySelectorAll(`.cell:nth-child(${row + 1})`);
      for (const cell of cells) {
        cell.classList.add(className);
      }
    }

    for (const row of ls.drumRows) {
      addRowClasses(row, "drums");
    }

    if (ls.useModRow) {
      addRowClasses(ls.modRow, "mod-row");
      for (const section of Object.values(ls.modSections).slice(0, -1)) {
        const endCell = shadowRoot.querySelector(
          `.column:nth-child(${section[1] + 1}) .cell:nth-child(${
            ls.modRow + 1
          })`
        );
        endCell.classList.add("mod-section-end");
      }
    }
  }

  function initControls() {
    const playToggle = document.querySelector("#play-toggle");
    playToggle.addEventListener("click", () => {
      if (Tone.Transport.state === "started") {
        Tone.Transport.stop();
        playToggle.textContent = "▶";
        playToggle.title = "Play";
      } else {
        Tone.Transport.start();
        playToggle.textContent = "⏸";
        playToggle.title = "Pause";
      }
    });
    updateBpm();
    document.querySelector("#bpm").addEventListener("input", updateBpm);
  }

  function injectSequencerStyle() {
    const { shadowRoot } = document.querySelector("tone-step-sequencer");
    const style = document.querySelector("#sequencer-style");
    shadowRoot.appendChild(style);
  }

  function updateBpm() {
    const bpm = document.querySelector("#bpm");
    Tone.Transport.bpm.value = parseFloat(bpm.value);
    const bpmLabel = document.querySelector("label[for=bpm]");
    bpmLabel.textContent = `Tempo: ${bpm.value} BPM`;
  }
})();
