import * as Phaser from "phaser";

// Card images
import { images, spritesheets } from "./constants/assets";
import { textStyle } from "./constants/font";
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

  public preload(): void {
    // Background
    const image = this.add.image(
      SCREEN_WIDTH / 2,
      SCREEN_HEIGHT / 2,
      "img_load"
    );
    image.setScale(SCREEN_WIDTH / image.width, SCREEN_HEIGHT / image.height);

    const progressBarWidth = 110;
    const progressBarHeight = 10;
    const progressBarX = SCREEN_WIDTH / 2 - progressBarWidth / 2;
    const progressBarY = SCREEN_HEIGHT * 0.75 - progressBarHeight / 2;

    const progressBox = this.add.graphics();
    progressBox.fillStyle(0xaaaaaa, 0.8);
    progressBox.fillRect(
      progressBarX,
      progressBarY,
      progressBarWidth,
      progressBarHeight
    );

    const progressBar = this.add.graphics();

    const { height, width } = this.cameras.main;

    const assetText = this.make.text({
      style: textStyle(8, "#000000"),
      text: "",
      x: width / 2,
      y: height / 2 + 100,
    });

    assetText.setOrigin(0.5, 0.5);

    this.load.on("progress", (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0x000000, 1);
      progressBar.fillRect(
        progressBarX + 2,
        progressBarY + 2,
        (progressBarWidth - 4) * value,
        progressBarHeight - 4
      );
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
    images.forEach(({ key, file }) => {
      this.load.image(key, file);
    });

    // Spritesheets
    spritesheets.forEach(({ file, frameHeight, frameWidth, key }) => {
      this.load.spritesheet(key, file, { frameHeight, frameWidth });
    });
  }

  public create(): void {
    this.scene.start("GameState");
  }
}
