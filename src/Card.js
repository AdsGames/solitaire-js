import Phaser from "phaser";

import Piles from "./Piles.js";

export default class Card extends Phaser.GameObjects.Sprite {
  constructor(scene, suit, value) {
    // Create sprite
    super(scene, 0, 0, "img_card_back_green");
    scene.add.existing(this);

    // Suit and Value
    this.suit = suit;
    this.value = value;

    this.pile = "none";
    this.position = -1;

    this.flipped = false;

    // Width and Height
    this.setDisplaySize(Piles.cardWidth, Piles.cardHeight);

    // Click event
    this.setInteractive();
  }

  reposition(pile, position) {
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
  }

  flip(scene) {
    this.setTexture(this.selectImage(this.suit, this.value));
    scene.input.setDraggable(this);
    this.flipped = true;
  }

  flipBack(scene) {
    this.setTexture("img_card_back_green");
    scene.input.setDraggable(this, false);
    this.flipped = false;
  }

  selectImage(suit, value) {
    return `img_card_${value}_${suit}`;
  }
}
