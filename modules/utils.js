(function () {
  const isDev = location.origin === "file://";
  const sequencer = document.querySelector("tone-step-sequencer");
  const volumes = {
    lead: -16,
    drums: -12,
    bass: -12,
    metronome: -20,
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
    isDev,
    sequencer,
    wrapAround,
  };
})();
