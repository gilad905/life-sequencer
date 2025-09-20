const toggler = document.querySelector("tone-play-toggle");
toggler.addEventListener("start", () => Tone.Transport.start());
toggler.addEventListener("stop", () => Tone.Transport.stop());

const slider = document.querySelector("tone-slider");
slider.addEventListener(
  "input",
  (e) => (Tone.Transport.bpm.value = parseFloat(e.target.value))
);

const synthKeys = ["A3", "Db4", "E4", "Gb4"];

const loop = new Tone.Loop(onTick, "8n").start(0);

const sequencer = document.querySelector("tone-step-sequencer");
for (let i = 0; i < sequencer.rows; i++) {
  sequencer._matrix[i][i] = true;
}
sequencer.requestUpdate();

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

function onTick(time) {
  window.ls.gol.step();
}
