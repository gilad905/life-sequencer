(function () {
  const isDev = location.origin === "file://";
  const sequencer = document.querySelector("tone-step-sequencer");
  const volumes = {
    lead: -16,
    drums: -12,
    bass: -12,
    metronome: -20,
  };

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
  const modSections = {
    leadWave: [0, 2],
    leadKey: [3, 5],
    drums: [6, 9],
    bassWave: [10, 12],
    bassKey: [13, 15],
  };

  function wrapAround(x, y) {
    const { _matrix } = sequencer;
    while (x < 0) x += _matrix.length;
    while (x >= _matrix.length) x -= _matrix.length;
    while (y < 0) y += _matrix[0].length;
    while (y >= _matrix[0].length) y -= _matrix[0].length;
    return { x, y };
  }

  window.ls ??= {};
  window.ls = {
    ...window.ls,
    //
    volumes,
    keyGroups,
    waveTypes,
    drumSamples,
    drumLibs,
    modSections,
    isDev,
    sequencer,
    wrapAround,
  };
})();
