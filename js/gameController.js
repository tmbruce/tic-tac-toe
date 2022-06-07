import events from "./events.js";
import init, { find_move } from "../test-wasm/pkg/test_wasm.js";

const GameController = (() => {
  init();
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

  const resetTurnCount = () => (_turnNumber = 0);

  const _resetGame = () => {
    _turnNumber = 0;
    _currentPlayer = _players[0];
    events.emit("resetBoard");
  };

  const calcLine = (point1, point2) => {
    let gameContainer = document.querySelector(".game-container");
    // gameContainer.getBoundingClientRect()
    let length = Math.round(
      Math.sqrt(
        Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
      )
    );
    let angle = Math.round(
      Math.atan2(point2.y - point1.y, point2.x - point1.x) * (180 / Math.PI)
    );
    return { length, angle };
  };

  const declareWinner = (vec) => {
    let strikeThrough = document.querySelector("#strike-through");
    let winningCells = [];
    vec.forEach((point) => {
      winningCells.push(document.getElementById(`cell-${parseInt(point) + 1}`));
    });
    console.log(winningCells[0].getBoundingClientRect());
    let { length, angle } = calcLine(
      winningCells[0].getBoundingClientRect(),
      winningCells[2].getBoundingClientRect()
    );
  };

  const checkWinner = () => {
    let res = find_move(board.toString());
    let [win, vec] = res.split("-");
    vec = [...vec];
    if (win == "true") {
      declareWinner(vec);
    }
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
    checkWinner();
  };

  const _getBoard = (data) => (board = data);

  const checkValidMove = (index) => (board[index] == "" ? true : false);

  //Events
  events.on("boardUpdate", (data) => _getBoard(data));
  events.on("cellClick", () => events.emit("getBoard"));
  events.on("resetGame", () => _resetGame);

  //Method Exposure
  return {
    getCurrentPlayer,
    switchPlayer,
    checkValidMove,
    getPlayerID,
    getTurnNumber,
    _getBoard,
  };
})();

export default GameController;
