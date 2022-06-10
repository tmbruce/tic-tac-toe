import events from "./events.js";

const SettingsModal = (() => {
  //Variables
  let modal = document.querySelector("#modal");
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

  const createSettingsModal = () => {
    let html = createHtmlElement(`
    <div class="modal-content">
      <button class="close-btn">Close</button>
      <div class="settings-title">Settings</div>
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
    if (!gameActive || data.type == "winMessage") {
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
