import events from "./events.js";

const GameController = (() => {
  //Variables
  let _turnNumber = 0;
  let _players = ["X", "O"];
  let _currentPlayer = _players[0];

  //DOM Bindings
  let player1 = document.querySelector("#player1");
  let player2 = document.querySelector("#player2");
  //Methods
  const getCurrentPlayer = () => _currentPlayer;

  const getTurnNumber = () => _turnNumber;

  const _resetGame = () => {
    _turnNumber = 0;
    _currentPlayer = _players[0];
    events.emit("resetBoard");
  };
  const _toggleClass = (element) => {
    element.classList.toggle("player");
    element.classList.toggle("player-active");
  };
  const switchPlayer = () => {
    _currentPlayer == _players[0]
      ? (_currentPlayer = _players[1])
      : (_currentPlayer = _players[0]);
    _toggleClass(player1);
    _toggleClass(player2);
  };

  const resetTurnCount = () => {
    _turnNumber = 0;
  };

  const play = (data) => {
    let move = { mark: getCurrentPlayer(), index: data };
    events.emit("playerMove", move);
    switchPlayer();
  };

  //Events
  events.on("cellClick", (data) => {
    play(data);
  });
  //Method Exposure
  return { getCurrentPlayer };
})();

export default GameController;
