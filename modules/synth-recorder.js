(function () {
  async function recordSynths() {
    const keys = ["Gb3", "A3", "B3", "Db4", "E4", "Gb4"];
    // const types = ["sine"];
    const types = ["square", "sine", "triangle", "sawtooth"];
    const recorder = new Tone.Recorder();
    recorder.mimeType = "audio/webm";

    console.log("synth recording starting");

    for (const type of types) {
      const synth = new Tone.Synth({
        oscillator: { type },
      }).connect(recorder);

      for (const key of keys) {
        const name = `${type}-${key}`;
        const blob = await recordKey(synth, key, recorder);
        const wavBlob = await webmToWav(blob);
        const url = URL.createObjectURL(wavBlob);
        createLink(url, `${name}.wav`);
      }
    }

    console.log("synth recording done");
  }

  async function recordKey(synth, key, recorder) {
    await new Promise((resolve) => {
      synth.onsilence = resolve;
      // Tone.Transport.scheduleOnce((time) => {
      recorder.start();
      // }, "+0.050");
      synth.triggerAttackRelease(key, "16t");
    });
    const recording = await recorder.stop();
    return recording;
  }

  function createLink(url, filename) {
    const anchor = document.createElement("a");
    anchor.style.display = "block";
    anchor.download = filename;
    anchor.href = url;
    anchor.innerText = anchor.download;
    document.body.prepend(anchor);
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

  async function webmToWav(blob) {
    const arrayBuffer = await blob.arrayBuffer();
    const audioCtx = new AudioContext();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

    function audioBufferToWav(buffer) {
      const numOfChan = buffer.numberOfChannels;
      const length = buffer.length * numOfChan * 2 + 44;
      const bufferArray = new ArrayBuffer(length);
      const view = new DataView(bufferArray);

      function writeString(view, offset, string) {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
      }

      let offset = 0;
      // RIFF header
      writeString(view, offset, "RIFF");
      offset += 4;
      view.setUint32(offset, length - 8, true);
      offset += 4;
      writeString(view, offset, "WAVE");
      offset += 4;
      writeString(view, offset, "fmt ");
      offset += 4;
      view.setUint32(offset, 16, true);
      offset += 4; // PCM chunk size
      view.setUint16(offset, 1, true);
      offset += 2; // PCM format
      view.setUint16(offset, numOfChan, true);
      offset += 2;
      view.setUint32(offset, buffer.sampleRate, true);
      offset += 4;
      view.setUint32(offset, buffer.sampleRate * numOfChan * 2, true);
      offset += 4;
      view.setUint16(offset, numOfChan * 2, true);
      offset += 2;
      view.setUint16(offset, 16, true);
      offset += 2;
      writeString(view, offset, "data");
      offset += 4;
      view.setUint32(offset, length - offset - 4, true);
      offset += 4;

      // Write PCM samples
      for (let i = 0; i < buffer.length; i++) {
        for (let ch = 0; ch < numOfChan; ch++) {
          let sample = buffer.getChannelData(ch)[i];
          sample = Math.max(-1, Math.min(1, sample));
          view.setInt16(
            offset,
            sample < 0 ? sample * 0x8000 : sample * 0x7fff,
            true
          );
          offset += 2;
        }
      }

      return new Blob([view], { type: "audio/wav" });
    }

    return audioBufferToWav(audioBuffer);
  }

  async function zipBlobs(blobs) {
    const zip = new JSZip();
    for (const [name, blob] of Object.entries(blobs)) {
      zip.file(name, blob);
    }
    const content = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(content);
    a.download = "all_wav.zip";
    a.click();
  }

  if (ls.isDev) {
    // showDrumLinks();
    Tone.Transport.on("start", recordSynths);
  }
})();
