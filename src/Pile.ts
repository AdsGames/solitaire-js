import { CARD_DIMENSIONS, STACK_OFFSET } from "./constants/deck";
import { PileId, PILE_POSITIONS, TABLEAU_PILES } from "./constants/table";

export class Pile extends Phaser.GameObjects.Zone {
  public pileId: PileId;

  public constructor(scene: Phaser.Scene, pileId: PileId) {
    super(scene, 0, 0, 0, 0);

    this.pileId = pileId;

    // Additional height for tableau
    const addHeight = TABLEAU_PILES.includes(this.pileId)
      ? STACK_OFFSET * 10
      : 0;
    const addWidth = this.pileId === PileId.Stock ? 20 : 0;

    // Get position
    const position = PILE_POSITIONS[this.pileId];

    // Make zone
    this.setPosition(position.x + addWidth / 2, position.y + addHeight / 2);
    this.setSize(
      CARD_DIMENSIONS.width + addWidth,
      CARD_DIMENSIONS.height + addHeight
    );

    const zone = this.setRectangleDropZone(this.width, this.height);
    zone.setName(this.pileId);

    // Drop zone visual
    if (this.pileId !== PileId.None) {
      this.scene.add
        .graphics()
        .lineStyle(1, 0xffffff)
        .strokeRect(
          this.x - this.width / 2,
          this.y - this.height / 2,
          CARD_DIMENSIONS.width,
          CARD_DIMENSIONS.height
        );
    }
  }
}
