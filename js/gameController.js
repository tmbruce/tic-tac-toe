import events from "./events.js";

let gameController = (() => {
  //Variables
  let _turnNumber = 0;
  let _players = ["X", "Y"];
  let _currentPlayer = _players[0];

  //DOM Bindings

  //Methods
  const _resetGame = () => {
    _turnNumber = 0;
    _currentPlayer = _players[0];
    events.emit("resetBoard");
  };

  const switchPlayer = () =>
    _currentPlayer == _players[0]
      ? _currentPlayer == _players[1]
      : _currentPlayer == _players[0];

  const resetTurnCount = () => {
    _turnNumber = 0;
  };

  //Events
})();
