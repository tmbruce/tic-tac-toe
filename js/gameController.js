import events from "./events.js";

const GameController = (() => {
  //Variables
  let _turnNumber = 0;
  let playerId = ["X", "O"];
  let _players = ["X", "O"];
  let _currentPlayer = _players[0];
  let board = [];
  //DOM Bindings
  let player1 = document.querySelector("#player1");
  let player2 = document.querySelector("#player2");
  //Methods
  const getCurrentPlayer = () => _currentPlayer;

  const getPlayerID = () => {
    return playerId.shift();
  };

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
    _turnNumber += 1;
    _toggleClass(player1);
    _toggleClass(player2);
  };

  const resetTurnCount = () => (_turnNumber = 0);

  const _getBoard = (data) => (board = data);

  const checkValidMove = (index) => (board[index] == "" ? true : false);

  //Events
  events.on("boardUpdate", (data) => _getBoard(data));
  events.on("cellClick", () => {
    events.emit("getBoard");
  });

  //Method Exposure
  return { getCurrentPlayer, switchPlayer, checkValidMove, getPlayerID };
})();

export default GameController;
