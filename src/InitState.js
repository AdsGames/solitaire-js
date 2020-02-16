import Phaser from "phaser";

export default class InitState extends Phaser.Scene {
  constructor() {
    super({ active: false, key: "InitState" });
  }

  preload() {
    this.load.baseURL =
      window.location.toString().replace(/[^/]*$/gu, "") +
      document
        .querySelector('script[src$="main.js"]')
        .getAttribute("src")
        .replace("main.js", "");

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

    // Background
    this.load.image("img_background", "assets/img/background.png");

    // Cards
    this.load.image("img_card_1_0", "assets/img/cards/AC.png");
    this.load.image("img_card_1_3", "assets/img/cards/AD.png");
    this.load.image("img_card_1_1", "assets/img/cards/AH.png");
    this.load.image("img_card_1_2", "assets/img/cards/AS.png");

    this.load.image("img_card_2_0", "assets/img/cards/2C.png");
    this.load.image("img_card_2_3", "assets/img/cards/2D.png");
    this.load.image("img_card_2_1", "assets/img/cards/2H.png");
    this.load.image("img_card_2_2", "assets/img/cards/2S.png");

    this.load.image("img_card_3_0", "assets/img/cards/3C.png");
    this.load.image("img_card_3_3", "assets/img/cards/3D.png");
    this.load.image("img_card_3_1", "assets/img/cards/3H.png");
    this.load.image("img_card_3_2", "assets/img/cards/3S.png");

    this.load.image("img_card_4_0", "assets/img/cards/4C.png");
    this.load.image("img_card_4_3", "assets/img/cards/4D.png");
    this.load.image("img_card_4_1", "assets/img/cards/4H.png");
    this.load.image("img_card_4_2", "assets/img/cards/4S.png");

    this.load.image("img_card_5_0", "assets/img/cards/5C.png");
    this.load.image("img_card_5_3", "assets/img/cards/5D.png");
    this.load.image("img_card_5_1", "assets/img/cards/5H.png");
    this.load.image("img_card_5_2", "assets/img/cards/5S.png");

    this.load.image("img_card_6_0", "assets/img/cards/6C.png");
    this.load.image("img_card_6_3", "assets/img/cards/6D.png");
    this.load.image("img_card_6_1", "assets/img/cards/6H.png");
    this.load.image("img_card_6_2", "assets/img/cards/6S.png");

    this.load.image("img_card_7_0", "assets/img/cards/7C.png");
    this.load.image("img_card_7_3", "assets/img/cards/7D.png");
    this.load.image("img_card_7_1", "assets/img/cards/7H.png");
    this.load.image("img_card_7_2", "assets/img/cards/7S.png");

    this.load.image("img_card_8_0", "assets/img/cards/8C.png");
    this.load.image("img_card_8_3", "assets/img/cards/8D.png");
    this.load.image("img_card_8_1", "assets/img/cards/8H.png");
    this.load.image("img_card_8_2", "assets/img/cards/8S.png");

    this.load.image("img_card_9_0", "assets/img/cards/9C.png");
    this.load.image("img_card_9_3", "assets/img/cards/9D.png");
    this.load.image("img_card_9_1", "assets/img/cards/9H.png");
    this.load.image("img_card_9_2", "assets/img/cards/9S.png");

    this.load.image("img_card_10_0", "assets/img/cards/10C.png");
    this.load.image("img_card_10_3", "assets/img/cards/10D.png");
    this.load.image("img_card_10_1", "assets/img/cards/10H.png");
    this.load.image("img_card_10_2", "assets/img/cards/10S.png");

    this.load.image("img_card_11_0", "assets/img/cards/JC.png");
    this.load.image("img_card_11_3", "assets/img/cards/JD.png");
    this.load.image("img_card_11_1", "assets/img/cards/JH.png");
    this.load.image("img_card_11_2", "assets/img/cards/JS.png");

    this.load.image("img_card_12_0", "assets/img/cards/QC.png");
    this.load.image("img_card_12_3", "assets/img/cards/QD.png");
    this.load.image("img_card_12_1", "assets/img/cards/QH.png");
    this.load.image("img_card_12_2", "assets/img/cards/QS.png");

    this.load.image("img_card_13_0", "assets/img/cards/KC.png");
    this.load.image("img_card_13_3", "assets/img/cards/KD.png");
    this.load.image("img_card_13_1", "assets/img/cards/KH.png");
    this.load.image("img_card_13_2", "assets/img/cards/KS.png");

    // Backs
    this.load.image("img_card_back_green", "assets/img/cards/green_back.png");
  }

  create() {
    this.scene.start("GameState");
  }
}
