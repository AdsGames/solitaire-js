import * as Phaser from "phaser";

import { CARD_CORNER_RADIUS, CARD_DIMENSIONS } from "./constants/deck";
import { SCREEN_HEIGHT } from "./constants/screen";
import { DEPTH } from "./constants/depth";
import { PileId, PILE_POSITIONS, TABLEAU_PILES } from "./constants/table";

/**
 * Drop zone and outline for one pile. Tableau zones reach the bottom of the
 * screen so cards can drop anywhere on a long column.
 */
export class Pile extends Phaser.GameObjects.Zone {
  public readonly pileId: PileId;

  public constructor(scene: Phaser.Scene, pileId: PileId) {
    const { x, y } = PILE_POSITIONS[pileId];
    const top = y - CARD_DIMENSIONS.height / 2;
    const height = TABLEAU_PILES.includes(pileId)
      ? SCREEN_HEIGHT - top
      : CARD_DIMENSIONS.height;

    super(scene, x, top + height / 2, CARD_DIMENSIONS.width, height);

    this.pileId = pileId;
    this.setRectangleDropZone(this.width, this.height);

    // The stock is tapped to draw, so its zone sits above the cards
    if (pileId === PileId.Stock) {
      this.setDepth(DEPTH.stock);
      if (this.input) {
        this.input.cursor = "pointer";
      }
    }

    // Outline sits inside the card edge (half-pixel inset) so a card covers it
    scene.add
      .graphics()
      .lineStyle(1, 0xffffff)
      .strokeRoundedRect(
        x - CARD_DIMENSIONS.width / 2 + 0.5,
        top + 0.5,
        CARD_DIMENSIONS.width - 1,
        CARD_DIMENSIONS.height - 1,
        CARD_CORNER_RADIUS
      );
  }
}
