initElements();
initSynths();

function initElements() {
  const toggler = document.querySelector("tone-play-toggle");
  toggler.addEventListener("start", () => Tone.Transport.start());
  toggler.addEventListener("stop", () => Tone.Transport.stop());

  const slider = document.querySelector("tone-slider");
  slider.addEventListener(
    "input",
    (e) => (Tone.Transport.bpm.value = parseFloat(e.target.value))
  );

  // const sequencer = document.querySelector("tone-step-sequencer");
  // for (let i = 0; i < sequencer.rows; i++) {
  //   sequencer._matrix[i][i] = true;
  // }
  // sequencer.requestUpdate();

  document.querySelector("#clear").addEventListener("click", () => {
    for (let y = 0; y < sequencer._matrix.length; y++) {
      for (let x = 0; x < sequencer._matrix[y].length; x++) {
        sequencer._matrix[y][x] = false;
      }
    }
    sequencer.requestUpdate();
  });
}

function initSynths() {
  const sequencer = document.querySelector("tone-step-sequencer");
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
    synth.toDestination();
  }

  sequencer.addEventListener("trigger", ({ detail }) => {
    const synthI = parseInt((detail.row / sequencer.rows) * 3);
    const synth = synths[synthI];
    const synthRow = detail.row % (sequencer.rows / 3);
    if (synthI == 1) {
      synth.player(synthRow).start(detail.time, 0, "16t");
    } else {
      synth.triggerAttackRelease(synthKeys[synthRow], "16t", detail.time);
    }
  });
}
