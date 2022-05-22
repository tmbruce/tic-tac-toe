import events from "./js/events.js";

let resetBtn = document.querySelector("#reset");
resetBtn.addEventListener("click", () => {
  events.emit("resetBoard");
});
