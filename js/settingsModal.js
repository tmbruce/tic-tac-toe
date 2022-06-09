import events from "./events.js";

const SettingsModal = (() => {
  //Variables

  //DOM Bindings
  let modal = document.querySelector("#modal");
  let title = document.createElement("h2");
  title.classList.add("settings-title");
  title.textContent = "Settings";
  let closeBtn = document.createElement("button");
  closeBtn.classList.add("close-btn");
  closeBtn.textContent = "Close";

  //Methods
  const _openSettings = () => {
    modal.append(title, closeBtn);
    modal.showModal();
  };

  closeBtn.addEventListener("click", () => {
    while (modal.firstChild) {
      modal.removeChild(modal.firstChild);
    }
    modal.close();
  });

  //Events
  events.on("openSettings", () => _openSettings());
})();

export default SettingsModal;
