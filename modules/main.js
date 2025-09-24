(function () {
  initControls();
  injectSequencerStyle();

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
