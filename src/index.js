import Phaser from "phaser";

import InitState from "./InitState.js";
import GameState from "./GameState.js";
import PreInitState from "./PreInitState.js";

// eslint-disable-next-line no-new
new Phaser.Game({
  backgroundColor: "#000",
  height: 400,
  parent: "game-container",
  scene: [PreInitState, InitState, GameState],
  type: Phaser.AUTO,
  width: 550,
});
