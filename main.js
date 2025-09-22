(function () {
  const modRowI = 6;
  const synthKeys = ["A3", "Db4", "E4", "Gb4"];
  const drumSamples = ["hihat", "kick", "snare", "tom1"];
  const drumLibs = ["4OP-FM", "Bongos"];
  // const drumLibs = ["4OP-FM", "KPR77"];
  const voices = initVoices();
  initElements();
  injectSequencerStyle();
  let currentDrumLib = 0;

  function injectSequencerStyle() {
    const { shadowRoot } = document.querySelector("tone-step-sequencer");
    const style = document.querySelector("#sequencer-style");
    shadowRoot.appendChild(style);
  }

  function initElements() {
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

  function updateBpm() {
    const bpm = document.querySelector("#bpm");
    Tone.Transport.bpm.value = parseFloat(bpm.value);
    const bpmLabel = document.querySelector("label[for=bpm]");
    bpmLabel.textContent = `Tempo: ${bpm.value} BPM`;
  }

  function initVoices() {
    const voices = [
      new Tone.PolySynth(Tone.Synth, { oscillator: { type: "sine" } }),
      new Tone.Players({
        baseUrl: `https://tonejs.github.io/audio/drum-samples/`,
        urls: [
          ...drumSamples.map((d) => `${drumLibs[0]}/${d}.mp3`),
          ...drumSamples.map((d) => `${drumLibs[1]}/${d}.mp3`),
        ],
        fadeOut: "64n",
      }),
      new Tone.PolySynth(Tone.Synth, { oscillator: { type: "sawtooth" } }),
    ];

    for (const voice of voices) {
      voice.volume.value = ls.defaultVolume;
      voice.toDestination();
    }

    ls.sequencer.addEventListener("trigger", onSequencerTrigger);
    return voices;
  }

  function onSequencerTrigger({ detail }) {
    if (detail.row == modRowI) {
      return;
    } else {
      if (detail.row > modRowI) {
        detail.row--;
      }
      const voiceI = parseInt(
        (detail.row / (ls.sequencer.rows - 1)) * voices.length
      );
      const voice = voices[voiceI];
      const voiceRow = detail.row % ((ls.sequencer.rows - 1) / voices.length);
      if (voice.name == "Players") {
        const drumIndex = voiceRow + currentDrumLib * 4;
        voice.player(drumIndex).start(detail.time, 0, "16t");
      } else {
        voice.triggerAttackRelease(synthKeys[voiceRow], "16t", detail.time);
      }
    }
  }

  function applyModRow() {
    const { _matrix } = ls.sequencer;
    voices[0].set({
      detune: _matrix[0][modRowI] ? 600 : 0,
      oscillator: { type: _matrix[1][modRowI] ? "square" : "sine" },
    });
    voices[2].set({
      detune: _matrix[2][modRowI] ? -600 : 0,
      oscillator: { type: _matrix[3][modRowI] ? "triangle" : "sawtooth" },
    });
    currentDrumLib = _matrix[4][modRowI] ? 1 : 0;
  }

  window.ls ??= {};
  window.ls = { ...window.ls, applyModRow };
})();
