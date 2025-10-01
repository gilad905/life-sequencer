(function () {
  const metronomeCbx = document.querySelector("#metronome");
  const keys = ["C7", "C6"];
  const players = [];

  for (const key of keys) {
    const player = ls.createPlayer({
      url: `${ls.assetsUrl}/metronome-samples/metronome-${key}.wav`,
      volume: ls.volumes.metronome,
      fadeOut: "64n",
    });
    players.push(player);
  }

  ls.addStepAction((time, index) => {
    if (metronomeCbx.checked) {
      if (index % 4 === 0) {
        const onFirstNote = index === 0;
        const player = players[onFirstNote ? 0 : 1];
        player.start(time);
      }
    }
  });
})();
