(function () {
  const synthKeys = ["A3", "Db4", "E4", "Gb4"];
  const drumSamples = ["hihat", "kick", "snare", "tom1"];
  const drumLibs = ["4OP-FM"];
  const waveTypes = ["sine", "square", "triangle", "sawtooth"];

  const noteDuration = "16t";
  const modRowI = 6;
  const useModRow = false;

  const urls = getSampleUrls();
  let currentDrumLib = 0;

  const players = initPlayers();
  ls.sequencer.addEventListener("trigger", onSequencerTrigger);

  function initPlayers() {
    const voices = [
      new Tone.PolySynth(Tone.Synth, { oscillator: { type: "sine" } }),
      new Tone.Players({
        baseUrl: "/assets/",
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

    const voiceI = parseInt((detail.row / voiceRowCount) * players.length);
    const voice = players[voiceI];
    const voiceRow = detail.row % (voiceRowCount / players.length);
    const drumIndex = voiceRow + currentDrumLib * 4;
    voice.player(drumIndex).start(detail.time, 0, noteDuration);
  }

  function applyModRow() {
    if (!useModRow) return;
    const { _matrix } = ls.sequencer;
    players[0].set({
      detune: _matrix[1][modRowI] ? 1200 : 0,
      oscillator: { type: _matrix[4][modRowI] ? "square" : "sine" },
    });
    players[2].set({
      detune: _matrix[7][modRowI] ? -1200 : 0,
      oscillator: { type: _matrix[10][modRowI] ? "triangle" : "sawtooth" },
    });
    currentDrumLib = _matrix[13][modRowI] ? 1 : 0;
  }

  function getSampleUrls() {
    const urls = {};
    for (const lib of drumLibs) {
      for (const sample of drumSamples) {
        urls[`${lib}-${sample}`] = `${lib}/${sample}.mp3`;
      }
    }
    for (const type of waveTypes) {
      for (const key of synthKeys) {
        urls[`${type}-${key}`] = `synth-samples/${type}-${key}.mp4`;
      }
    }
    return urls;
  }

  window.ls ??= {};
  window.ls = { ...window.ls, applyModRow };
})();
