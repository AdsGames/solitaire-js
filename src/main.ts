import * as Phaser from "phaser";

import InitState from "./InitState";
import GameState from "./GameState";
import PreInitState from "./PreInitState";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "./constants/screen";

const config: Phaser.Types.Core.GameConfig = {
  antialias: false,
  antialiasGL: false,
  roundPixels: true,
  backgroundColor: "#000",
  height: SCREEN_HEIGHT,
  parent: "game-container",
  scene: [PreInitState, InitState, GameState],
  type: Phaser.AUTO,
  width: SCREEN_WIDTH,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

export const game = new Phaser.Game(config);
