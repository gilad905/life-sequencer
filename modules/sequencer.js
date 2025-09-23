(function () {
  const modRowI = 6;
  const useModRow = false;
  const synthKeys = ["A3", "Db4", "E4", "Gb4"];
  const drumSamples = ["hihat", "kick", "snare", "tom1"];
  const drumLibs = ["4OP-FM", "Bongos"];
  // const drumLibs = ["4OP-FM", "KPR77"];
  let currentDrumLib = 0;

  const voices = initVoices();
  ls.sequencer.addEventListener("trigger", onSequencerTrigger);

  function initVoices() {
    const voices = [
      new Tone.PolySynth(Tone.Synth, { oscillator: { type: "sine" } }),
      new Tone.Players({
        baseUrl: `https://tonejs.github.io/audio/drum-samples/`,
        urls: [
          ...drumSamples.map((d) => `${drumLibs[0]}/${d}.mp3`),
          ...drumSamples.map((d) => `${drumLibs[1]}/${d}.mp3`),
        ],
        fadeOut: "64n",
      }),
      new Tone.PolySynth(Tone.Synth, { oscillator: { type: "sawtooth" } }),
    ];

    for (const voice of voices) {
      voice.volume.value = ls.defaultVolume;
      voice.toDestination();
    }

    return voices;
  }

  function onSequencerTrigger({ detail }) {
    let voiceRowCount = ls.sequencer.rows;
    if (useModRow) {
      voiceRowCount--;
      if (detail.row == modRowI) {
        return;
      } else if (detail.row > modRowI) {
        detail.row--;
      }
    }

    const voiceI = parseInt((detail.row / voiceRowCount) * voices.length);
    const voice = voices[voiceI];
    const voiceRow = detail.row % (voiceRowCount / voices.length);
    if (voice.name == "Players") {
      const drumIndex = voiceRow + currentDrumLib * 4;
      voice.player(drumIndex).start(detail.time, 0, "16t");
    } else {
      voice.triggerAttackRelease(synthKeys[voiceRow], "16t", detail.time);
    }
  }

  function applyModRow() {
    if (!useModRow) return;
    const { _matrix } = ls.sequencer;
    voices[0].set({
      detune: _matrix[1][modRowI] ? 1200 : 0,
      oscillator: { type: _matrix[4][modRowI] ? "square" : "sine" },
    });
    voices[2].set({
      detune: _matrix[7][modRowI] ? -1200 : 0,
      oscillator: { type: _matrix[10][modRowI] ? "triangle" : "sawtooth" },
    });
    currentDrumLib = _matrix[13][modRowI] ? 1 : 0;
  }

  window.ls ??= {};
  window.ls = { ...window.ls, applyModRow };
})();
