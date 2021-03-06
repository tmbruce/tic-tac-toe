import events from "./events.js";
import init, { find_move } from "../wasm.js";

const GameController = (() => {
  //Initialize WASM bindings
  init();
  //Variables
  let _turnNumber = 0;
  let gameActive = true;
  let playerId = ["X", "O"];
  let _players = ["X", "O"];
  let _currentPlayer = _players[0];
  let board = [];
  let difficulty = 0.25;
  let gameSettings = {};

  //DOM Bindings
  let player1 = document.querySelector("#player1");
  let player2 = document.querySelector("#player2");
  let strikeThrough = document.querySelector("#strike-through");
  //Methods
  const getCurrentPlayer = () => _currentPlayer;

  const getDifficulty = () => difficulty;

  const getPlayerID = () => {
    return playerId.shift();
  };

  const getTurnNumber = () => _turnNumber;

  const _updateDifficulty = (data) => {
    switch (data.difficulty) {
      case "easy":
        difficulty = 0.25;
        break;
      case "medium":
        difficulty = 0.4;
        break;
      case "difficult":
        difficulty = 0.6;
        break;
      case "EXTREME!":
        difficulty = 1;
        break;
    }
  };

  const _resetGame = () => {
    strikeThrough.style.cssText = "";
    gameActive = true;
    _turnNumber = 0;
    _currentPlayer = _players[0];
    if (player2.classList.contains("player-active")) {
      _toggleClass(player1);
      _toggleClass(player2);
    }
    events.emit("resetBoard");
    events.emit("gameActive", gameActive);
    if ("player1" in gameSettings && !gameSettings.player1) getBestMove();
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
    let data = {
      type: "winMessage",
      player: winningCells[0].textContent,
    };
    setTimeout(() => {
      events.emit("openModal", data);
    }, 600);
  };

  const getBestMove = () => {
    let bestMove;
    if (_turnNumber == 0) {
      bestMove = find_move(`${_currentPlayer} ,,,,,,,,`);
    } else {
      bestMove = find_move(`${_currentPlayer} ${board.toString()}`);
    }
    let threshold = Math.random();
    if (difficulty > threshold) {
      events.emit("cellClick", bestMove);
    } else {
      let openSpots = [];
      board.forEach((v, i) => {
        if (v == "") {
          openSpots.push(i);
        }
      });
      events.emit(
        "cellClick",
        openSpots[Math.floor(threshold * openSpots.length)]
      );
    }
  };

  const checkWinner = () => {
    let str = _currentPlayer + " " + board;
    let res = find_move(str);
    let [win, vec] = res.split("-");
    if (win == "true") {
      vec = [...vec];
      gameActive = false;
      events.emit("gameActive", gameActive);
      declareWinner(vec);
    } else if (_turnNumber == 9) {
      gameActive = false;
      let data = { type: "tie" };
      events.emit("gameActive", gameActive);
      events.emit("openModal", data);
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
    if (_turnNumber > 0) checkWinner();
    if (_currentPlayer == "X" && gameSettings.player1 == false) getBestMove();
    if (_currentPlayer == "O" && gameSettings.player2 == false) getBestMove();
  };
  const isGameActive = () => gameActive;

  const _getBoard = (data) => (board = data);

  const checkValidMove = (index) => (board[index] == "" ? true : false);

  //Events
  events.on("boardUpdate", (data) => _getBoard(data));
  events.on("cellClick", () => events.emit("getBoard"));
  events.on("resetGame", _resetGame);
  events.on("updateDifficulty", (data) => _updateDifficulty(data));
  events.on("gameSettings", (data) => {
    gameSettings = data;
  });
  events.on("botPlay", () => getBestMove());

  //Method Exposure
  return {
    getCurrentPlayer,
    switchPlayer,
    checkValidMove,
    getPlayerID,
    getTurnNumber,
    _getBoard,
    isGameActive,
    getDifficulty,
  };
})();

export default GameController;
