(function () {
  const anchor = document.createElement("a");
  const recorder = new Tone.Recorder();
  recorder.mimeType = "audio/mp4";

  async function recordSynth(synth, note, duration) {
    const synth = new Tone.Synth().connect(recorder);
    recorder.start();
    synth.triggerAttackRelease(note, duration);
    await new Promise((resolve) => setTimeout(resolve, duration * 1000));
    const recording = await recorder.stop();
    const url = URL.createObjectURL(recording);
    anchor.download = `${synth.type}-${note}.mp4`;
    anchor.href = url;
    anchor.click();
  }

  window.ls ??= {};
  window.ls.recordSynth = recordSynth;
})();
