import Phaser from "phaser";

// Card images
import { images } from "./constants/assets";
import { baseURL } from "./constants/loading";

export default class InitState extends Phaser.Scene {
  constructor() {
    super({ active: false, key: "InitState" });
  }

  preload() {
    // Set base url
    this.load.baseURL = baseURL;

    // Background
    this.add.image(550 / 2, 400 / 2, "img_load");

    const progressBox = this.add.graphics();
    progressBox.fillStyle(0xaaaaaa, 0.8);
    progressBox.fillRect(215, 270, 110, 10);

    const progressBar = this.add.graphics();

    const { height, width } = this.cameras.main;

    const assetText = this.make.text({
      style: {
        fill: "#000000",
        font: "12px monospace",
      },
      text: "",
      x: width / 2,
      y: height / 2 + 100,
    });

    assetText.setOrigin(0.5, 0.5);

    this.load.on("progress", value => {
      progressBar.clear();
      progressBar.fillStyle(0x000000, 1);
      progressBar.fillRect(217, 272, 106 * value, 6);
    });

    this.load.on("fileprogress", file =>
      assetText.setText(`Loading asset: ${file.key}`)
    );

    this.load.on("complete", () => {
      progressBar.destroy();
      progressBox.destroy();
      assetText.destroy();
    });

    // Images
    images.forEach(({ key, file }) => this.load.image(key, file));
  }

  create() {
    this.scene.start("GameState");
  }
}
