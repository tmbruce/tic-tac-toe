import events from "./events.js";
import GameController from "./gameController.js";

const Player = () => {
  //Variables
  let human = true;
  let playerType = GameController.getPlayerID();
  //DOM Bindings

  //Methods
  const isHuman = () => {
    return human;
  };

  const getPlayerType = () => {
    return playerType;
  };

  const changePlayerType = () => {
    human = !human;
  };

  return { getPlayerType, changePlayerType, isHuman };
};

export default Player;
