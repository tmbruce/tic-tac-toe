import events from "./events.js";
import GameController from "./gameController.js";

const Player = () => {
  //Variables
  let human = true;
  let playerType = GameController.getPlayerID();
  //DOM Bindings

  //Methods
  const getPlayerType = () => {
    return playerType;
  };

  const changePlayerType = () => {
    human = !human;
  };

  return { getPlayerType };
};

export default Player;
