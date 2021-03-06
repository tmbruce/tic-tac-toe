import events from "./js/events.js";
import Player from "./js/player.js";
import GameController from "./js/gameController.js";

let player1 = Player();
let player2 = Player();
let settingsBtn = document.querySelector("#gear-icon");
let board = [];

settingsBtn.addEventListener("click", () => {
  let data = { type: "settings" };
  events.emit("openModal", data);
});

const _updatePlayerType = (data) => {
  if (data.player == "player1") {
    player1.changePlayerType();
    if (!player1.isHuman() && GameController.getTurnNumber() == 0) {
      events.emit("botPlay");
    }
  } else {
    player2.changePlayerType();
  }
};

const _getBoard = (data) => (board = data);

const play = (data) => {
  if (GameController.isGameActive()) {
    let mark =
      GameController.getCurrentPlayer() == player1.getPlayerType()
        ? player1.getPlayerType()
        : player2.getPlayerType();
    if (GameController.checkValidMove(data)) {
      let move = { mark: mark, index: data };
      events.emit("playerMove", move);
      GameController.switchPlayer();
    }
  }
};

events.on("updatePlayerType", (data) => _updatePlayerType(data));
events.on("cellClick", (data) => play(data));
events.on("boardUpdate", (data) => _getBoard(data));
