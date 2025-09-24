(function () {
  const synthKeys = ["A3", "Db4", "E4", "Gb4"];
  const waveTypes = {
    top: ["sawtooth", "square"],
    bass: ["sine", "triangle"],
  };
  const drumSamples = ["hihat", "kick", "snare", "tom1"];
  const drumLibs = ["4OP-FM"];
  let currentDrumLib = drumLibs[0];
  let currentTopSynth = waveTypes.top[0];
  let currentBassSynth = waveTypes.bass[0];

  const useModRow = false;
  const modRowI = 6;

  const players = initPlayers();
  ls.sequencer.addEventListener("trigger", onSequencerTrigger);

  function initPlayers() {
    const baseUrl = "https://gilad905.github.io/life-sequencer/assets/";

    const players = { drums: {}, synths: {} };

    for (const lib of drumLibs) {
      players.drums[lib] = {};
      for (const sample of drumSamples) {
        const url = `${baseUrl}${lib}/${sample}.mp3`;
        players.drums[lib][sample] = new Tone.Player({
          url,
          volume: ls.volumes.drums,
          fadeOut: "64n",
        }).toDestination();
      }
    }

    for (const synthType of Object.keys(waveTypes)) {
      players.synths[synthType] = {};
      for (const waveType of waveTypes[synthType]) {
        players.synths[synthType][waveType] = {};
        for (const key of synthKeys) {
          const url = `${baseUrl}synth-samples/${waveType}-${key}.wav`;
          players.synths[synthType][waveType][key] = new Tone.Player({
            url,
            volume: ls.volumes[`${synthType}Synth`],
          }).toDestination();
        }
      }
    }

    return players;
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

    const voiceI = 2 - parseInt((detail.row / voiceRowCount) * 3);
    const voiceRow = detail.row % (voiceRowCount / 3);

    if (voiceI == 0) {
      const player = players.synths.top[currentTopSynth][synthKeys[voiceRow]];
      player.start(detail.time);
    } else if (voiceI == 2) {
      const player = players.synths.bass[currentBassSynth][synthKeys[voiceRow]];
      player.start(detail.time);
    } else if (voiceI == 1) {
      const player = players.drums[currentDrumLib][drumSamples[voiceRow]];
      player.start(detail.time, 0, "16t");
    }
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

  window.ls ??= {};
  window.ls = { ...window.ls, applyModRow };
})();
