const toggler = document.querySelector("tone-play-toggle");
toggler.addEventListener("start", () => Tone.Transport.start());
toggler.addEventListener("stop", () => Tone.Transport.stop());

const slider = document.querySelector("tone-slider");
slider.addEventListener(
  "input",
  (e) => (Tone.Transport.bpm.value = parseFloat(e.target.value))
);

const synthKeys = ["A3", "Db4", "E4", "Gb4"];

const sequencers = document.querySelectorAll("tone-step-sequencer");
for (let i = 0; i < sequencers.length; i++) {
  const sequencer = sequencers[i];
  const type = sequencer.dataset.lsType;

  for (let j = 0; j < 4; j++) {
    sequencer._updateCell(j + i * 4, j);
  }

  if (type === "drums") {
    const drumPlayers = new Tone.Players({
      baseUrl: "https://tonejs.github.io/audio/drum-samples/4OP-FM/",
      urls: { 0: "hihat.mp3", 1: "kick.mp3", 2: "snare.mp3", 3: "tom1.mp3" },
      fadeOut: "64n",
    }).toDestination();
    sequencer.addEventListener("trigger", ({ detail }) => {
      drumPlayers.player(detail.row).start(detail.time, 0, "16t");
    });
  } else {
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type },
    }).toDestination();

    sequencer.addEventListener("trigger", ({ detail }) => {
      synth.triggerAttackRelease(synthKeys[detail.row], "16t", detail.time);
    });
  }
}
