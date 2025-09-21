(function () {
  initElements();
  initSynths();

  function initElements() {
    const toggler = document.querySelector("tone-play-toggle");
    toggler.addEventListener("start", () => Tone.Transport.start());
    toggler.addEventListener("stop", () => Tone.Transport.stop());

    const slider = document.querySelector("tone-slider");
    Tone.Transport.bpm.value = parseFloat(slider.value);
    slider.addEventListener(
      "input",
      (e) => (Tone.Transport.bpm.value = parseFloat(e.target.value))
    );
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
