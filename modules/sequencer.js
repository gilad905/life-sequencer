(function () {
  const synthKeys = ["A3", "Db4", "E4", "Gb4"];
  const drumSamples = ["hihat", "kick", "snare", "tom1"];
  const drumLibs = ["4OP-FM"];
  const waveTypes = ["sine", "square", "triangle", "sawtooth"];

  const useModRow = false;
  const modRowI = 6;

  const players = initPlayers();
  ls.sequencer.addEventListener("trigger", onSequencerTrigger);

  function initPlayers() {
    const urls = getSampleUrls();
    const flatUrls = [
      Object.values(urls.synths.sine),
      Object.values(urls.drums[drumLibs[0]]),
      Object.values(urls.synths.square),
    ].flat();
    const players = new Tone.Players({
      baseUrl: "https://gilad905.github.io/life-sequencer/assets/",
      volume: ls.defaultVolume,
      urls: flatUrls,
    });
    players.toDestination();
    return players;
  }

  function onSequencerTrigger({ detail }) {
    if (useModRow) {
      if (detail.row == modRowI) {
        return;
      } else if (detail.row > modRowI) {
        detail.row--;
      }
    }
    players.player(detail.row).start(detail.time);
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
    const urls = { drums: {}, synths: {} };
    for (const lib of drumLibs) {
      urls.drums[lib] = {};
      for (const sample of drumSamples) {
        urls.drums[lib][sample] = `${lib}/${sample}.mp3`;
      }
    }
    for (const type of waveTypes) {
      urls.synths[type] = {};
      for (const key of synthKeys) {
        urls.synths[type][key] = `synth-samples/${type}-${key}.mp4`;
      }
    }
    return urls;
  }

  window.ls ??= {};
  window.ls = { ...window.ls, applyModRow };
})();
