(function () {
  const recorder = new Tone.Recorder();
  recorder.mimeType = "audio/mp4";

  async function recordSynth(_synth, note) {
    // synth.connect(recorder);
    const synth = new Tone.Synth().connect(recorder);
    recorder.start();
    synth.onsilence = console.log;
    // synth.onsilence += console.log;
    // synth.onsilence(console.log);
    synth.triggerAttackRelease(note, "16t");
    await new Promise((resolve) => setTimeout(resolve, 500));
    const recording = await recorder.stop();
    await new Promise((resolve) => setTimeout(resolve, 500));
    const url = URL.createObjectURL(recording);
    const { type } = synth.get("oscillator").oscillator;
    const anchor = document.createElement("a");
    anchor.style.display = "block";
    anchor.download = `${type}-${note}.mp4`;
    anchor.href = url;
    anchor.innerText = `Download ${anchor.download}`;
    document.body.prepend(anchor);
  }

  window.ls ??= {};
  window.ls.recordSynth = recordSynth;
})();
