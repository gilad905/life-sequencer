(function () {
  const useModRow = true;
  const modRow = 6;
  const drumRows = useModRow ? [4, 5, 7, 8] : [4, 5, 6, 7];
  const voices = initVoices();
  const currentVoices = [];

  initStepEvent();
  addSequencerClasses();

  ls.sequencer.addEventListener("step", (e) => {
    if (e.detail.index === 0) {
      applyModRow();
    }
  });

  ls.sequencer.addEventListener("trigger", onSequencerTrigger);

  function initVoices() {
    const baseUrl = "https://gilad905.github.io/life-sequencer/assets";
    const voices = { drums: [] };

    for (const lib of ls.drumLibs) {
      const libVoice = [];
      for (const sample of ls.drumSamples) {
        const player = createPlayer({
          url: `${baseUrl}/${lib}/${sample}.mp3`,
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
            const url = `${baseUrl}/synth-samples/${waveType}-${key}.wav`;
            const allKeys = waveTypeVoices.flat();
            let player = allKeys.find((p) => p._url == url);
            player ??= createPlayer({ url, volume });
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
    if (useModRow) {
      if (rowI == modRow) {
        return;
      } else if (voiceI > modRow) {
        voiceI--;
      }
    }
    if (drumRows.includes(rowI)) {
      currentVoices[voiceI].start(detail.time, 0, "16t");
    } else {
      currentVoices[voiceI].start(detail.time);
    }
  }

  function applyModRow() {
    // console.log("applying mod row");
    if (!useModRow) return;

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
    for (let col = colStart; col <= colEnd; col++) {
      if (ls.sequencer._matrix[col][modRow]) return 1;
    }
    return 0;

    // Alternative: majority
    // let countOn = 0;
    // for (let col = colStart; col <= colEnd; col++) {
    //   if (ls.sequencer._matrix[col][modRowI]) countOn++;
    // }
    // const countOff = colEnd - colStart + 1 - countOn;
    // return countOn > countOff ? 1 : 0;
  }

  function addSequencerClasses() {
    const { shadowRoot } = ls.sequencer;
    function addRowClasses(row, className) {
      const cells = shadowRoot.querySelectorAll(`.cell:nth-child(${row + 1})`);
      for (const cell of cells) {
        cell.classList.add(className);
      }
    }

    for (const row of drumRows) {
      addRowClasses(row, "drums");
    }

    if (useModRow) {
      addRowClasses(modRow, "mod-row");
      for (const section of Object.values(ls.modSections).slice(0, -1)) {
        const endCell = shadowRoot.querySelector(
          `.column:nth-child(${section[1] + 1}) .cell:nth-child(${modRow + 1})`
        );
        endCell.classList.add("mod-section-end");
      }
    }
  }

  function createPlayer(opts) {
    const player = new Tone.Player(opts).toDestination();
    player._url = opts.url;
    return player;
  }

  function initStepEvent() {
    ls.sequencer._sequencer.callback = (time, index) => {
      ls.sequencer.dispatchEvent(
        new CustomEvent("step", { detail: { time, index } })
      );
      ls.sequencer._tick(time, index);
    };
  }
})();
