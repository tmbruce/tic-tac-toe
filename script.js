import events from "./js/events.js";
import Player from "./js/player.js";

let player1 = Player("Player 1");
let player2 = Player("Player 2");

let resetBtn = document.querySelector("#reset");
resetBtn.addEventListener("click", () => {
  events.emit("resetBoard");
});
