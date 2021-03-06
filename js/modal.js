import events from "./events.js";

const SettingsModal = (() => {
  //Variables
  let modal = document.querySelector("#modal");
  let gameActive = true;
  let player = "";
  let gameSettings = { player1: true, player2: true, difficulty: "easy" };

  //DOM Bindings
  const modalEscape = (event) => {
    if (event.key == "Escape") {
      document.querySelector(".close-btn").click();
    }
  };

  const bindSettingsModal = () => {
    let human1 = document.querySelector("#human-1");
    let bot1 = document.querySelector("#bot-1");
    let human2 = document.querySelector("#human-2");
    let bot2 = document.querySelector("#bot-2");
    let p1 = [human1, bot1];
    let p2 = [human2, bot2];

    let diff1 = document.querySelector("#diff1");
    let diff2 = document.querySelector("#diff2");
    let diff3 = document.querySelector("#diff3");
    let diff4 = document.querySelector("#diff4");
    let difficulty = [diff1, diff2, diff3, diff4];

    gameSettings.player1 ? _toggleClass(human1) : _toggleClass(bot1);
    gameSettings.player2 ? _toggleClass(human2) : _toggleClass(bot2);

    let data = {};
    switch (gameSettings.difficulty) {
      case "easy":
        _toggleClass(diff1);
        events.emit("updateDifficulty", (data = { dificulty: "easy" }));
        break;
      case "medium":
        _toggleClass(diff2);
        events.emit("updateDifficulty", (data = { dificulty: "medium" }));
        break;
      case "difficult":
        _toggleClass(diff3);
        events.emit("updateDifficulty", (data = { dificulty: "difficult" }));
        break;
      case "EXTREME!":
        _toggleClass(diff4);
        events.emit("updateDifficulty", (data = { dificulty: "extreme" }));
        break;
    }

    p1.forEach((player) => {
      player.addEventListener("click", () => {
        if (!player.classList.contains("active")) {
          _toggleClass(...p1);
          let data = { player: "player1" };
          gameSettings.player1
            ? (gameSettings.player1 = false)
            : (gameSettings.player1 = true);
          if (gameSettings.player1 == false && gameSettings.player2 == false) {
            human2.click();
          }
          events.emit("resetGame");
          events.emit("updatePlayerType", data);
          events.emit("gameSettings", gameSettings);
        }
      });
    });

    p2.forEach((player) => {
      player.addEventListener("click", () => {
        if (!player.classList.contains("active")) {
          _toggleClass(...p2);
          let data = { player: "player2" };
          gameSettings.player2
            ? (gameSettings.player2 = false)
            : (gameSettings.player2 = true);
          if (gameSettings.player1 == false && gameSettings.player2 == false) {
            human1.click();
          }
          events.emit("resetGame");
          events.emit("updatePlayerType", data);
          events.emit("gameSettings", gameSettings);
        }
      });
    });

    difficulty.forEach((diff) => {
      diff.addEventListener("click", () => {
        if (!diff.classList.contains("active")) {
          _toggleClass(diff);
          let data = { difficulty: diff.textContent };
          events.emit("resetGame");
          events.emit("updateDifficulty", data);
          gameSettings.difficulty = diff.textContent;
        }
        difficulty.forEach((old) => {
          if (old.classList.contains("active") && old != diff) {
            _toggleClass(old);
          }
        });
      });
    });
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
      player = "";
    });
  };

  //Methods
  const _toggleClass = (...elements) => {
    elements.forEach((element) => {
      element.classList.toggle("active");
    });
  };

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
        <button class="player-type" id="human-1">Human</button>
        <button class="player-type" id="bot-1">Bot</button>
        <button class="player-type" id="human-2">Human</button>
        <button class="player-type" id="bot-2">Bot</button>
        <div class="bot-level">Bot difficulty</div>
        <button class="bot-difficulty" id="diff1" data-id="1">easy</button>
        <button class="bot-difficulty" id="diff2" data-id="2">medium</button>
        <button class="bot-difficulty" id="diff3" data-id="3">difficult</button>
        <button class="bot-difficulty" id="diff4" data-id="4">EXTREME!</button>
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
    if (data.type == "tie" || (!gameActive && player == "")) {
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
      bindSettingsModal();
    }
    bindCloseBtn();
  };

  //Events
  events.on("openModal", (data) => _openModal(data));
  events.on("gameActive", (data) => _updateGameActive(data));
})();

export default SettingsModal;
