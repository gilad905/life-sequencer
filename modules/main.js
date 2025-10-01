(function () {
  const defaultState = getStateParams();
  importQueryParams();
  initControls();
  addSequencerClasses();
  injectSequencerStyle();

  ls.allPlayersLoaded().then(() => {
    // console.debug("all players loaded");
    document.querySelector("#play-toggle").disabled = false;
    setPlayButtonState(true);
  });

  // if (ls.isDev) {
  //   ls.clearSequencer();
  //   ls.loadPattern(ls.patterns.diagonal_line);
  //   // const bpm = document.querySelector("#bpm");
  //   // bpm.value = 60;
  //   // updateBpm();
  //   const evolve = document.querySelector("#evolve");
  //   evolve.checked = false;
  // }

  function importQueryParams() {
    const params = new URLSearchParams(location.search);

    if (params.has("matrix")) {
      ls.matrixSerializer.importToken(params.get("matrix"));
    } else {
      const defaultPattern = ls.patterns[Object.keys(ls.patterns)[1]];
      ls.loadPattern(defaultPattern);
    }

    if (params.has("evolve")) {
      const evolve = document.querySelector("#evolve");
      evolve.checked = params.get("evolve") === "1";
    }
    if (params.has("metronome")) {
      const metronome = document.querySelector("#metronome");
      metronome.checked = params.get("metronome") === "1";
    }
    if (params.has("bpm")) {
      const bpm = document.querySelector("#bpm");
      bpm.value = params.get("bpm");
    }
    if (params.has("evolveEvery")) {
      const evolveEvery = document.querySelector("#evolve-every");
      evolveEvery.value = params.get("evolveEvery");
    }
    return params;
  }

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
    playToggle.addEventListener("click", onPlayToggleClick);

    updateBpm();
    document.querySelector("#bpm").addEventListener("input", updateBpm);

    ls.updateEvolveState();
    const evolveEvery = document.querySelector("#evolve-every");
    evolveEvery.addEventListener("change", ls.updateEvolveState);

    const copyLinkButton = document.querySelector("#copy-link");
    copyLinkButton._popover = new bootstrap.Popover(copyLinkButton);
    copyLinkButton.addEventListener("click", onCopyLinkClick);
  }

  function onCopyLinkClick(ev) {
    const params = getStateParams();
    for (const [key, value] of defaultState) {
      if (params.get(key) === value) {
        params.delete(key);
      }
    }

    const token = ls.matrixSerializer.getToken();
    params.set("matrix", token);
    let url = `${location.origin}${location.pathname}`;
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    navigator.clipboard.writeText(url);
    ev.target._popover.show();
    setTimeout(() => ev.target._popover.hide(), 1000);
  }

  function onPlayToggleClick() {
    if (Tone.getTransport().state === "started") {
      Tone.getTransport().stop();
      setPlayButtonState(true);
    } else {
      Tone.getTransport().start();
      setPlayButtonState(false);
    }
  }

  function setPlayButtonState(toPlay) {
    const playToggle = document.querySelector("#play-toggle");
    if (toPlay) {
      playToggle.textContent = "▶";
      playToggle.title = "Play";
    } else {
      playToggle.textContent = "⏸";
      playToggle.title = "Pause";
    }
  }

  function getStateParams() {
    function cbxValue(id) {
      return document.querySelector(`#${id}`).checked ? "1" : "0";
    }
    const params = new URLSearchParams(location.search);
    params.set("evolve", cbxValue("evolve"));
    params.set("metronome", cbxValue("metronome"));
    params.set("bpm", document.querySelector("#bpm").value);
    params.set("evolveEvery", document.querySelector("#evolve-every").value);
    return params;
  }

  function injectSequencerStyle() {
    const { shadowRoot } = document.querySelector("tone-step-sequencer");
    const style = document.querySelector("#sequencer-style");
    shadowRoot.appendChild(style);
  }

  function updateBpm() {
    const bpm = document.querySelector("#bpm");
    Tone.getTransport().bpm.value = parseFloat(bpm.value);
    const bpmLabel = document.querySelector("label[for=bpm]");
    bpmLabel.textContent = `Tempo: ${bpm.value} BPM`;
  }
})();
