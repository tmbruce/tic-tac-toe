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

  const calcLine = (point1, point2, vec) => {
    let length =
      Math.round(
        Math.sqrt(
          Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
        ) / 5
      ) * 5;
    let angle = 0;
    if (vec[1] == 1 || vec[1] == 7) angle = -90;
    if (vec[1] == 3 || vec[1] == 5) angle = 0;
    if (vec[1] == 4 && vec[0] == 0) angle = 45;
    if (vec[1] == 4 && vec[0] == 2) angle = -45;
    if (vec[1] == 4 && vec[0] == 3) angle = -90;
    return { length, angle };
  };

  const declareWinner = (vec) => {
    const LINE_WIDTH = 10;
    let strikeThrough = document.querySelector("#strike-through");
    let gameContainer = document.querySelector(".game-container");
    let winningCells = [];
    vec.forEach((point) => {
      winningCells.push(document.getElementById(`cell-${parseInt(point) + 1}`));
    });
    let { length, angle } = calcLine(
      winningCells[0].getBoundingClientRect(),
      winningCells[2].getBoundingClientRect(),
      vec
    );
    let container = gameContainer.getBoundingClientRect();
    let center = winningCells[1].getBoundingClientRect();
    let cY = center.top - container.top + 0.5 * center.height;
    let cX =
      center.left - container.left + 0.5 * center.width - 0.5 * LINE_WIDTH;
    let style = `top: ${cY}px; left: ${cX}px; transform: rotate(${
      angle * -1
    }deg) scaleY(${length * 1.5}); height: 1px; width: 10px; position: absolute;
    transform-origin: center;
    z-index: 1;
    background-color: white;
    display: block;`;
    strikeThrough.style.cssText = style;
    setTimeout(() => {
      let modal = document.querySelector("#modal");
      let div = document.createElement("div");
      div.textContent = `${winningCells[0].textContent} wins!`;
      div.classList.add("win-message");
      modal.append(div);
      modal.showModal();
    }, 600);
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
