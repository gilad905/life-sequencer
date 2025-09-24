(function () {
  const stepActions = [];

  ls.sequencer._sequencer.callback = (time, index) => {
    for (const { action } of stepActions) {
      action(time, index);
    }
    ls.sequencer._tick(time, index);
  };

  function addStepAction(action, priority = 1) {
    stepActions.push({ action, priority });
    stepActions.sort((a, b) => b.priority - a.priority);
  }

  window.ls ??= {};
  window.ls.addStepAction = addStepAction;
})();
