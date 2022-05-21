import events from "./events.js";

let gameBoard = (() => {
  //Variables
  let _gameBoard = ["X", "X", "O", "O", "X", "O", "X", "O", "O"];

  //Events
  events.on("resetBoard", _resetBoard);
  events.on("playerMove", _playerMove);

  //DOM Bindings

  //Methods
  const _render = () => {
    _gameBoard.forEach((val, index) => {});
  };
  const _playerMove = (mark, index) => {
    _gameBoard[index] = mark;
    _render();
  };
  const _resetBoard = () => {
    _gameBoard = ["", "", "", "", "", "", "", "", ""];
    _render();
  };
})();
