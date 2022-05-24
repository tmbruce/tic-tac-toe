import events from "./events.js";

const GameBoard = (() => {
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

  const _playerMove = (move) => {
    if (_gameBoard[move.index] == "") {
      _gameBoard[move.index] = move.mark;
      _render();
    }
  };
  const getBoard = () => _gameBoard;

  const _resetBoard = () => {
    _gameBoard = ["", "", "", "", "", "", "", "", ""];
    _render();
  };

  //Initial Render
  _render();

  //Events
  events.on("resetBoard", _resetBoard);
  events.on("playerMove", _playerMove);
})();

export default GameBoard;
