import events from "./events.js";

const Player = (playerName) => {
  //Variables
  let _playerName = playerName;

  //DOM Bindings

  //Methods

  const getName = () => _playerName;

  const setName = (name) => (_playerName = name);

  //Events

  //Method Exposure
  return { getName, setName };
};

export default Player;
