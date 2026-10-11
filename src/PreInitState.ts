import * as Phaser from "phaser";

import { FONT_FILE, FONT_KEY } from "./constants/font";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  key: "PreInitState",
  visible: false,
};

export default class PreInitState extends Phaser.Scene {
  public constructor() {
    super(sceneConfig);
  }

  public preload(): void {
    this.load.image("img_load", "assets/img/loading.png");
    this.load.font(FONT_KEY, FONT_FILE);
  }

  public create(): void {
    this.scene.start("InitState");
  }
}
