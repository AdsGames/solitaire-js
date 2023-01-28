import * as Phaser from "phaser";

// Card images
import { images, spritesheets } from "./constants/assets";
import { baseURL } from "./constants/loading";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "./constants/screen";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  key: "InitState",
  visible: false,
};

export default class InitState extends Phaser.Scene {
  public constructor() {
    super(sceneConfig);
  }

  // eslint-disable-next-line max-lines-per-function
  public preload(): void {
    // Set base url
    this.load.baseURL = baseURL;

    // Background
    this.add.image(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, "img_load");

    const progressBox = this.add.graphics();
    progressBox.fillStyle(0xaaaaaa, 0.8);
    progressBox.fillRect(215, 270, 110, 10);

    const progressBar = this.add.graphics();

    const { height, width } = this.cameras.main;

    const assetText = this.make.text({
      style: {
        color: "#000000",
        font: "12px monospace",
      },
      text: "",
      x: width / 2,
      y: height / 2 + 100,
    });

    assetText.setOrigin(0.5, 0.5);

    this.load.on("progress", (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0x000000, 1);
      progressBar.fillRect(217, 272, 106 * value, 6);
    });

    this.load.on("fileprogress", (file: { key: string }) =>
      assetText.setText(`Loading asset: ${file.key}`)
    );

    this.load.on("complete", () => {
      progressBar.destroy();
      progressBox.destroy();
      assetText.destroy();
    });

    // Images
    images.forEach(({ key, file }) => this.load.image(key, file));

    // Spritesheets
    spritesheets.forEach(({ file, frameHeight, frameWidth, key }) => {
      this.load.spritesheet(key, file, { frameHeight, frameWidth });
    });
  }

  public create(): void {
    this.scene.start("GameState");
  }
}
