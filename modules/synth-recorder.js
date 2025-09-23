if (!ls.isDev) {
  throw new Error("synth-recorder should be used in dev mode only");
}

async function recordSynths() {
  const keys = ["Gb3", "A3", "B3", "Db4", "E4", "Gb4"];
  const types = ["square", "sine", "triangle", "sawtooth"];
  const recorder = new Tone.Recorder();
  recorder.mimeType = "audio/wav";

  console.log("starting synth recording");

  for (const type of types) {
    const synth = new Tone.Synth({
      oscillator: { type },
    }).connect(recorder);

    for (const key of keys) {
      await new Promise((resolve) => {
        synth.onsilence = resolve;
        synth.triggerAttackRelease(key, "16t");
        recorder.start();
      });
      const recording = await recorder.stop();
      const url = URL.createObjectURL(recording);
      const anchor = document.createElement("a");
      anchor.style.display = "block";
      anchor.download = `${type}-${key}.wav`;
      anchor.href = url;
      anchor.innerText = anchor.download;
      document.body.prepend(anchor);

      return;
    }
  }
  console.log("synth recording done");
}

function showDrumLinks() {
  const baseUrl = "https://tonejs.github.io/audio/drum-samples/";
  const drumSamples = ["hihat", "kick", "snare", "tom1"];
  const drumLibs = ["4OP-FM", "Bongos"];
  for (const lib of drumLibs) {
    for (const sample of drumSamples) {
      const url = `${baseUrl}${lib}/${sample}.mp3`;
      const anchor = document.createElement("a");
      anchor.download = `${lib}-${sample}.mp3`;
      anchor.style.display = "block";
      anchor.href = url;
      anchor.target = "_blank";
      anchor.innerText = url;
      document.body.prepend(anchor);
    }
  }
}

// showDrumLinks();
Tone.Transport.on("start", recordSynths);
