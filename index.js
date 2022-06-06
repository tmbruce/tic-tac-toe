import events from "./js/events.js";
import Player from "./js/player.js";
import GameController from "./js/gameController.js";

let player1 = Player();
let player2 = Player();
let settingsBtn = document.querySelector("#gear-icon");
let board = [];

settingsBtn.addEventListener("click", () => {
  let settingsModal = document.querySelector("#modal");
  // let text = document.createElement("p");
  // text.textContent = "Hello, World!";
  // settingsModal.append(text);
  settingsModal.showModal();
});
const _getBoard = (data) => (board = data);

const play = (data) => {
  let mark =
    GameController.getCurrentPlayer() == player1.getPlayerType()
      ? player1.getPlayerType()
      : player2.getPlayerType();
  if (GameController.checkValidMove(data)) {
    let move = { mark: mark, index: data };
    events.emit("playerMove", move);
    GameController.switchPlayer();
  }
};

events.on("cellClick", (data) => play(data));
events.on("boardUpdate", (data) => _getBoard(data));
