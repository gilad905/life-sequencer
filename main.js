const keys = new Tone.Players({
  baseUrl: "https://tonejs.github.io/audio/casio/",
  urls: { 0: "A1.mp3", 1: "Cs2.mp3", 2: "E2.mp3", 3: "Fs2.mp3" },
  fadeOut: "64n",
}).toDestination();

const toggler = document.querySelector("tone-play-toggle");
toggler.addEventListener("start", () => Tone.Transport.start());
toggler.addEventListener("stop", () => Tone.Transport.stop());

const slider = document.querySelector("tone-slider");
slider.addEventListener(
  "input",
  (e) => (Tone.Transport.bpm.value = parseFloat(e.target.value))
);

const sequencer = document.querySelector("tone-step-sequencer");
sequencer.addEventListener("trigger", ({ detail }) => {
  console.log(detail);
  keys.player(detail.row).start(detail.time, 0, "16t");
});
