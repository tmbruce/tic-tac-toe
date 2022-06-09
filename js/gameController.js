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
    if (player2.classList.contains("player-active")) {
      _toggleClass(player1);
      _toggleClass(player2);
    }
    events.emit("resetBoard");
  };

  const calcAngle = (vec) => {
    let angle = 0;
    if (vec[1] == 1 || vec[1] == 7) angle = -90;
    if (vec[1] == 3 || vec[1] == 5) angle = 0;
    if (vec[1] == 4 && vec[0] == 0) angle = -45;
    if (vec[1] == 4 && vec[0] == 2) angle = 45;
    if (vec[1] == 4 && vec[0] == 3) angle = -90;
    return angle;
  };

  const calcLine = (centerX, centerY, containerWidth, angle) => {
    const LINE_WIDTH = 10;
    let length = 0;
    let aY,
      aX = 0;
    switch (angle) {
      case -90:
        aX = -10;
        aY = centerY - 0.5 * LINE_WIDTH;
        length = 2 * centerX;
        break;
      case 0:
        aX = centerX - 0.5 * LINE_WIDTH;
        aY = 0;
        length = 2 * centerY;
        break;
      case -45:
        aX = -1 - 0.5 * LINE_WIDTH;
        aY = 2 - 0.5 * LINE_WIDTH;
        length = 2 * Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2));
        break;
      case 45:
        aX = containerWidth - 1 - 0.5 * LINE_WIDTH;
        aY = 0.5 * LINE_WIDTH - 2;
        length = 2 * Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2));
    }
    return { aX, aY, length };
  };

  const calcCellCentroid = (center, container) => {
    let cY = center.top - container.top + 0.5 * center.height;
    let cX = center.left - container.left + 0.5 * center.width;
    return { cX, cY };
  };

  const createLineStyle = (aX, aY, angle, length) => {
    return `top: ${aY}px; left: ${aX}px; transform: rotate(${angle}deg); height: ${length}px; width: 10px; position: absolute;
    transform-origin: top right;
    z-index: 10;
    border-radius: 10px;
    background-color: white;
    display: block;`;
  };

  const declareWinner = (vec) => {
    let strikeThrough = document.querySelector("#strike-through");
    let gameContainer = document.querySelector(".game-container");
    let winningCells = [];
    vec.forEach((point) => {
      winningCells.push(document.getElementById(`cell-${parseInt(point) + 1}`));
    });
    let angle = calcAngle(vec);
    let container = gameContainer.getBoundingClientRect();
    let center = winningCells[1].getBoundingClientRect();
    let { cX, cY } = calcCellCentroid(center, container);
    let { aX, aY, length } = calcLine(cX, cY, container.width, angle);
    strikeThrough.style.cssText = createLineStyle(aX, aY, angle, length);
    let modal = document.querySelector("#modal");
    let resetBtn = document.createElement("button");
    resetBtn.textContent = "Reset game!";
    resetBtn.classList.add("reset-btn");
    resetBtn.addEventListener("click", () => {
      modal.close();
      _resetGame();
      style = "";
      strikeThrough.style.cssText = style;
      while (modal.firstChild) {
        modal.removeChild(modal.firstChild);
      }
    });
    let div = document.createElement("div");
    div.textContent = `${winningCells[0].textContent} wins!`;
    let closeBtn = document.createElement("button");
    closeBtn.classList.add("close-btn");
    closeBtn.textContent = "Close";
    closeBtn.addEventListener("click", () => {
      modal.close();
    });
    setTimeout(() => {
      div.classList.add("win-message");
      modal.showModal();
      modal.append(div, closeBtn, resetBtn);
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
