(function () {
  const evolveCbx = document.querySelector("#evolve");
  const metronomeCbx = document.querySelector("#metronome");

  const synth = new Tone.Synth({
    envelope: { release: 0.01 },
    volume: ls.volumes.metronome,
  }).toDestination();
  let tickCounter = 0;

  Tone.Transport.on("stop", () => {
    tickCounter = 0;
  });

  new Tone.Loop(onMetronomeTick, "2n").start(0);

  function onMetronomeTick(time) {
    window.ls.applyModRow();
    const onFirstNote = tickCounter % 4 == 0;
    if (metronomeCbx.checked) {
      const octave = onFirstNote ? 7 : 6;
      synth.triggerAttackRelease(`C${octave}`, "16t", time);
    }
    tickCounter++;
  }
})();
