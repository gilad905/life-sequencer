(function () {
  const metronomeCbx = document.querySelector("#metronome");

  const synth = new Tone.Synth({
    envelope: { release: 0.01 },
    volume: ls.volumes.metronome,
  }).toDestination();

  ls.addStepAction((time, index) => {
    if (metronomeCbx.checked) {
      if (index % 4 === 0) {
        const onFirstNote = index === 0;
        const octave = onFirstNote ? 7 : 6;
        synth.triggerAttackRelease(`C${octave}`, "16t", time);
      }
    }
  });
})();
