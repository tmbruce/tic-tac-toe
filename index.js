import events from "./js/events.js";
import Player from "./js/player.js";
import GameController from "./js/gameController.js";

let player1 = Player();
let player2 = Player();
let settingsBtn = document.querySelector("#gear-icon");

settingsBtn.addEventListener("click", () => {
  let settingsModal = document.createElement("dialog");
  document.body.append(settingsModal);
  settingsModal.showModal();
});
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
