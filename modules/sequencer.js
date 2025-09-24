(function () {
  const keyGroups = [
    ["Gb4", "E4", "Db4", "B3"],
    ["Db4", "B3", "A3", "Gb3"],
  ];
  const waveTypes = {
    lead: ["sawtooth", "square"],
    bass: ["sine", "triangle"],
  };
  const drumSamples = ["tom1", "snare", "kick", "hihat"];
  const drumLibs = ["4OP-FM", "Bongos"];

  const useModRow = true;
  const modRowI = 6;
  const voices = initVoices();
  const currentVoices = [];

  const sequencerEvent = new EventTarget();
  initSequencerEvent();

  sequencerEvent.addEventListener("step", (e) => {
    if (e.detail.index === 0) {
      applyModRow();
    }
  });

  ls.sequencer.addEventListener("trigger", onSequencerTrigger);

  function initVoices() {
    const baseUrl = "https://gilad905.github.io/life-sequencer/assets";
    const voices = { drums: [] };

    for (const lib of drumLibs) {
      const libVoice = [];
      for (const sample of drumSamples) {
        const player = createPlayer({
          url: `${baseUrl}/${lib}/${sample}.mp3`,
          volume: ls.volumes.drums,
          fadeOut: "64n",
        });
        libVoice.push(player);
      }
      voices.drums.push(libVoice);
    }

    for (const synthType of Object.keys(waveTypes)) {
      voices[synthType] = [];
      const volume = ls.volumes[synthType];
      for (const waveType of waveTypes[synthType]) {
        const waveTypeVoices = [];
        for (const keyGroup of keyGroups) {
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
    if (useModRow) {
      if (detail.row == modRowI) {
        return;
      } else if (detail.row > modRowI) {
        detail.row--;
      }
    }
    const rowI = currentVoices.length - detail.row - 1;
    const isDrums = rowI > 3 && rowI < 8;
    if (isDrums) {
      currentVoices[rowI].start(detail.time, 0, "16t");
    } else {
      currentVoices[rowI].start(detail.time);
    }
    // console.log("trigger", rowI, isDrums, currentVoices[rowI]._url);
  }

  function applyModRow() {
    // console.log("Applying mod row");
    if (!useModRow) return;

    currentVoices.length = 0;

    const leadWaveType = getModBit(0, 2);
    const leadKeyGroup = getModBit(3, 5);
    currentVoices.push(...voices.lead[leadWaveType][leadKeyGroup]);

    const drumLib = getModBit(6, 9);
    currentVoices.push(...voices.drums[drumLib]);

    const bassWaveType = getModBit(10, 12);
    const bassKeyGroup = getModBit(13, 15);
    currentVoices.push(...voices.bass[bassWaveType][bassKeyGroup]);

    // console.log(currentVoices.map((v) => v._url).join("\n"));
  }

  function getModBit(colStart, colEnd) {
    for (let col = colStart; col <= colEnd; col++) {
      if (ls.sequencer._matrix[col][modRowI]) return 1;
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

  function createPlayer(opts) {
    const player = new Tone.Player(opts).toDestination();
    player._url = opts.url;
    return player;
  }

  function initSequencerEvent() {
    ls.sequencer._sequencer.callback = (time, index) => {
      sequencerEvent.dispatchEvent(
        new CustomEvent("step", { detail: { time, index } })
      );
      ls.sequencer._tick(time, index);
    };
  }

  window.ls ??= {};
  window.ls.applyModRow = applyModRow;
  window.ls.sequencerEvent = sequencerEvent;
})();
