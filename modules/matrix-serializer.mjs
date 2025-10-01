(function () {
  function getToken() {
    const { _matrix } = window.ls.sequencer;
    const parts = [];

    for (let iRow = 0; iRow < _matrix[0].length; iRow++) {
      let num = 0;
      for (let iCol = 0; iCol < _matrix.length; iCol++) {
        if (_matrix[iCol][iRow]) {
          num |= 1 << iCol;
        }
      }
      parts.push(num);
    }

    for (let i = parts.length - 1; i >= 0; i--) {
      if (parts[i] || i === 0) {
        parts.length = i + 1;
        break;
      }
    }

    const hexParts = parts.map((num) => num.toString(16));
    return hexParts.join("-");
  }

  function importToken(token) {
    const { _matrix } = window.ls.sequencer;
    const rows = token.split("-");
    for (let iRow = 0; iRow < _matrix[0].length; iRow++) {
      const row = rows[iRow] || "0000";
      const num = parseInt(row, 16);
      for (let iCol = 0; iCol < _matrix.length; iCol++) {
        _matrix[iCol][iRow] = (num & (1 << iCol)) !== 0;
      }
    }
    ls.sequencer.requestUpdate();
  }

  window.ls ??= {};
  window.ls.matrixSerializer = {
    getToken,
    importToken,
  };
})();
