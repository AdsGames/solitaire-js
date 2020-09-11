import * as Phaser from "phaser";

import Piles from "./Piles";

export default class Card extends Phaser.GameObjects.Sprite {
  public suit: number = 0;

  public value: number = 0;

  public pile: string = "none";

  public position: number = -1;

  public flipped: boolean = false;

  public constructor(scene: Phaser.Scene, suit: number, value: number) {
    // Create sprite
    super(scene, 0, 0, "img_card_back_green");
    scene.add.existing(this);

    // Suit and Value
    this.suit = suit;
    this.value = value;

    // Width and Height
    this.setDisplaySize(Piles.cardWidth, Piles.cardHeight);

    // Click event
    this.setInteractive();
  }

  public reposition(pile: string, position: number): Card {
    this.pile = pile;
    this.position = position;

    this.setDepth(this.position + 10);

    if (this.pile === "stock" || this.pile === "discard") {
      this.setPosition(
        Piles.pilePositions[this.pile].x + position,
        Piles.pilePositions[this.pile].y
      );
    } else if (this.pile.match(/tableau_*/u)) {
      this.setPosition(
        Piles.pilePositions[this.pile].x,
        Piles.pilePositions[this.pile].y + position * 10
      );
    } else if (this.pile.match(/foundation_*/u)) {
      this.setPosition(
        Piles.pilePositions[this.pile].x,
        Piles.pilePositions[this.pile].y
      );
    }

    return this;
  }

  public flip(scene: Phaser.Scene): void {
    this.setTexture(this.selectImage(this.suit, this.value));
    scene.input.setDraggable(this);
    this.flipped = true;
  }

  public flipBack(scene: Phaser.Scene): void {
    this.setTexture("img_card_back_green");
    scene.input.setDraggable(this, false);
    this.flipped = false;
  }

  public selectImage(suit: number, value: number): string {
    return `img_card_${value}_${suit}`;
  }
}
