import * as Phaser from "phaser";

class Piles {
  public cardWidth: number = 65;

  public cardHeight: number = 100;

  public pilePositions: Record<string, Phaser.Math.Vector2> = {};

  public constructor() {
    this.pilePositions = {
      discard: new Phaser.Math.Vector2(145, 85),
      stock: new Phaser.Math.Vector2(45, 85),
    };

    for (let i = 0; i < 7; i += 1) {
      this.pilePositions[`tableau_${i}`] = new Phaser.Math.Vector2(
        45 + i * 75,
        200
      );
    }

    for (let i = 0; i < 4; i += 1) {
      this.pilePositions[`foundation_${i}`] = new Phaser.Math.Vector2(
        270 + i * 75,
        85
      );
    }
  }
}

export default new Piles();
