(function () {
  const loadPromises = [];

  function createPlayer(opts) {
    // console.debug("creating player", opts.url);
    const player = new Tone.Player(opts).toDestination();
    player._url = opts.url;
    const promise = new Promise((resolve) => {
      if (player.buffer.loaded) {
        resolve();
      } else {
        player.buffer.onload = () => resolve();
      }
    });
    loadPromises.push(promise);

    return player;
  }

  function allPlayersLoaded() {
    return Promise.all(loadPromises);
  }

  window.ls ??= {};
  window.ls.createPlayer = createPlayer;
  window.ls.allPlayersLoaded = allPlayersLoaded;
})();
