(function () {
  initElements();
  initSynths();

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

  function initSynths() {
    const synthKeys = ["A3", "Db4", "E4", "Gb4"];
    const synths = [
      new Tone.PolySynth(Tone.Synth, { oscillator: { type: "sine" } }),
      new Tone.Players({
        baseUrl: "https://tonejs.github.io/audio/drum-samples/4OP-FM/",
        urls: { 0: "hihat.mp3", 1: "kick.mp3", 2: "snare.mp3", 3: "tom1.mp3" },
        fadeOut: "64n",
      }),
      new Tone.PolySynth(Tone.Synth, { oscillator: { type: "sawtooth" } }),
    ];

    for (const synth of synths) {
      synth.volume.value = ls.defaultVolume;
      synth.toDestination();
    }

    ls.sequencer.addEventListener("trigger", ({ detail }) => {
      const synthI = parseInt((detail.row / ls.sequencer.rows) * 3);
      const synth = synths[synthI];
      const synthRow = detail.row % (ls.sequencer.rows / 3);
      if (synth.name == "Players") {
        synth.player(synthRow).start(detail.time, 0, "16t");
      } else {
        synth.triggerAttackRelease(synthKeys[synthRow], "16t", detail.time);
      }
    });
  }
})();
