import events from "./events.js";

const SettingsModal = (() => {
  //Variables
  let modal = document.querySelector("#modal");
  let human1 = document.querySelector("#human-1");
  let bot1 = document.querySelector("#bot-1");
  let human2 = document.querySelector("#human-2");
  let bot2 = document.querySelector("#bot-2");

  let gameActive = true;
  let player;

  //DOM Bindings
  const modalEscape = (event) => {
    if (event.key == "Escape") {
      document.querySelector(".close-btn").click();
    }
  };

  const bindCloseBtn = () => {
    let closeBtn = document.querySelector(".close-btn");
    closeBtn.addEventListener("click", () => {
      flush(modal);
      modal.close();
      document.removeEventListener("keydown", modalEscape);
    });
  };

  const bindResetBtn = () => {
    let resetBtn = document.querySelector(".reset-btn");
    resetBtn.addEventListener("click", () => {
      events.emit("resetGame");
      flush(modal);
      modal.close();
    });
  };

  //Methods
  const _updateGameActive = (data) => (gameActive = data);

  const flush = (element) => {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  };

  const createWinModal = (data) => {
    let html = createHtmlElement(`
    <div class="modal-content">
      <button class="close-btn">Close</button>
      <div class="win-message">${data} Wins!</div>
      <button class="reset-btn">Reset Game!</button>
    </div>
    `);
    return html;
  };

  const createTieModal = () => {
    let html = createHtmlElement(`
    <div class="modal-content">
      <button class="close-btn">Close</button>
      <div class="win-message">Tie! Try Again!</div>
      <button class="reset-btn">Reset Game!</button>
    </div>
    `);
    return html;
  };

  const createSettingsModal = () => {
    let html = createHtmlElement(`
    <div class="modal-content">
      <button class="close-btn">Close</button>
      <div class="settings-title">Settings</div>
      <div class="settings-container">
        <div class="player-name">Player 1</div>
        <div class="player-name">Player 2</div>
        <button class="player-type active" id="human-1">Human</button>
        <button class="player-type" id="bot-1">Bot</button>
        <button class="player-type active" id="human-2">Human</button>
        <button class="player-type" id="bot-2">Bot</button>
        <div class="bot-level">Bot difficulty</div>
        <button class="bot-difficulty active">easy</button>
        <button class="bot-difficulty">medium</button>
        <button class="bot-difficulty">difficult</button>
        <button class="bot-difficulty">EXTREME!</button>
    <div>
    `);
    return html;
  };

  const createHtmlElement = (html) => {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.firstElementChild;
  };

  const _openModal = (data) => {
    if ("player" in data) player = data.player;
    document.addEventListener("keydown", modalEscape);
    if (data.type == "tie" || (!gameActive && !("player" in data))) {
      modal.append(createTieModal());
      modal.showModal();
      bindResetBtn();
    } else if (!gameActive || data.type == "winMessage") {
      modal.append(createWinModal(player));
      modal.showModal();
      bindResetBtn();
    } else if (data.type == "settings") {
      modal.append(createSettingsModal());
      modal.showModal();
    }
    bindCloseBtn();
  };

  //Events
  events.on("openModal", (data) => _openModal(data));
  events.on("gameActive", (data) => _updateGameActive(data));
})();

export default SettingsModal;
