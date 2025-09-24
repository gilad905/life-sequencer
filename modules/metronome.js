(function () {
  const metronomeCbx = document.querySelector("#metronome");

  const synth = new Tone.Synth({
    envelope: { release: 0.01 },
    volume: ls.volumes.metronome,
  }).toDestination();

  ls.sequencer.addEventListener("step", (e) => {
    if (metronomeCbx.checked) {
      if (e.detail.index % 4 === 0) {
        const onFirstNote = e.detail.index === 0;
        const octave = onFirstNote ? 7 : 6;
        synth.triggerAttackRelease(`C${octave}`, "16t", e.detail.time);
      }
    }
  });
})();
