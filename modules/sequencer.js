(function () {
  const voices = initVoices();
  const currentVoices = [];
  updateCurrentVoices();

  if (ls.useModRow) {
    ls.addStepAction((time, index) => {
      if (index === 0) {
        updateCurrentVoices();
      }
    });
  }

  ls.sequencer.addEventListener("trigger", onSequencerTrigger);

  function initVoices() {
    const voices = { drums: [] };

    for (const lib of ls.drumLibs) {
      const libVoice = [];
      for (const sample of ls.drumSamples) {
        const player = ls.createPlayer({
          url: `${ls.assetsUrl}/${lib}/${sample}.mp3`,
          volume: ls.volumes.drums,
          fadeOut: "64n",
        });
        libVoice.push(player);
      }
      voices.drums.push(libVoice);
    }

    for (const synthType of Object.keys(ls.waveTypes)) {
      voices[synthType] = [];
      const volume = ls.volumes[synthType];
      for (const waveType of ls.waveTypes[synthType]) {
        const waveTypeVoices = [];
        for (const keyGroup of ls.keyGroups) {
          const groupVoice = [];
          for (const key of keyGroup) {
            const url = `${ls.assetsUrl}/synth-samples/${waveType}-${key}.wav`;
            const allKeys = waveTypeVoices.flat();
            let player = allKeys.find((p) => p._url == url);
            player ??= ls.createPlayer({ url, volume });
            groupVoice.push(player);
          }
          waveTypeVoices.push(groupVoice);
        }
        voices[synthType].push(waveTypeVoices);
      }
    }

    return voices;
  }

  function onSequencerTrigger({ detail }) {
    const rowI = ls.sequencer._matrix[0].length - detail.row - 1;
    let voiceI = rowI;
    if (ls.useModRow) {
      if (rowI == ls.modRow) {
        return;
      } else if (voiceI > ls.modRow) {
        voiceI--;
      }
    }
    if (ls.drumRows.includes(rowI)) {
      currentVoices[voiceI].start(detail.time, 0, "16t");
    } else {
      currentVoices[voiceI].start(detail.time);
    }
  }

  function updateCurrentVoices() {
    console.debug("updating current voices");

    currentVoices.length = 0;

    const leadWaveType = getModBit(ls.modSections.leadWave);
    const leadKeyGroup = getModBit(ls.modSections.leadKey);
    currentVoices.push(...voices.lead[leadWaveType][leadKeyGroup]);

    const drumLib = getModBit(ls.modSections.drums);
    currentVoices.push(...voices.drums[drumLib]);

    const bassWaveType = getModBit(ls.modSections.bassWave);
    const bassKeyGroup = getModBit(ls.modSections.bassKey);
    currentVoices.push(...voices.bass[bassWaveType][bassKeyGroup]);

    // console.log(currentVoices.map((v) => v._url).join("\n"));
  }

  function getModBit([colStart, colEnd]) {
    if (!ls.useModRow) return 0;
    for (let col = colStart; col <= colEnd; col++) {
      if (ls.sequencer._matrix[col][ls.modRow]) return 1;
    }
    return 0;

    // Alternative: majority
    // let countOn = 0;
    // for (let col = colStart; col <= colEnd; col++) {
    //   if (ls.sequencer._matrix[col][ls.modRowI]) countOn++;
    // }
    // const countOff = colEnd - colStart + 1 - countOn;
    // return countOn > countOff ? 1 : 0;
  }
})();
