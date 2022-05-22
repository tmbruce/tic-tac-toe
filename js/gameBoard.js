import events from "./events.js";

let gameBoard = (() => {
  //Variables
  let _gameBoard = ["", "", "", "", "", "", "", "", ""];
  let _cells = [];

  //DOM Bindings
  for (let i = 0; i < 9; i++) {
    let cell = document.querySelector(`#cell-${i + 1}`);
    cell.addEventListener("click", () => {
      events.emit("cellClick", cell.dataset.id);
    });
    _cells.push(cell);
  }

  //Methods
  const _render = () => {
    _gameBoard.forEach((val, index) => {
      _cells[index].textContent = val;
    });
  };

  const _playerMove = (mark, index) => {
    if (_gameBoard[index] == "") {
      _gameBoard[index] = mark;
      _render();
    }
  };

  const _resetBoard = () => {
    _gameBoard = ["", "", "", "", "", "", "", "", ""];
    _render();
  };

  const _cellClick = (cell) => {
    _gameBoard[cell] = "X";
    _render();
  };

  //Initial Render
  _render();

  //Events
  events.on("resetBoard", _resetBoard);
  events.on("playerMove", _playerMove);
  events.on("cellClick", _cellClick);
})();
