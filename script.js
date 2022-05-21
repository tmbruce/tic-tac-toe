import events from "./js/events.js";

let gameContainer = Array.from(
  document.querySelector(".game-container").children
);

gameContainer.forEach((cell) => {
  cell.addEventListener("click", () => {
    console.log(cell.id);
  });
});
