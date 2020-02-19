import Phaser from "phaser";

import { baseURL } from "./constants/loading";

export default class PreInitState extends Phaser.Scene {
  constructor() {
    super({ active: true, key: "PreInitState" });
  }

  preload() {
    // Set base url
    this.load.baseURL = baseURL;
    this.load.image("img_load", "assets/img/loading.png");
  }

  create() {
    this.scene.start("InitState");
  }
}
