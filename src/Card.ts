import * as Phaser from "phaser";
import {
  CARD_BACK_INDEX,
  CARD_DIMENSIONS,
  SPRITE_CARD_WIDTH,
  SUIT_IMAGE_INDEX,
  type Suit,
} from "./constants/deck";
import { DEPTH, FLIGHT_SLOTS } from "./constants/depth";

const MOVE_DURATION = 150;
const FLASH_DURATION = 200;

let flightOrder = 0;

export default class Card extends Phaser.GameObjects.Sprite {
  public readonly suit: Suit;

  public readonly value: number;

  public faceUp = false;

  public constructor(scene: Phaser.Scene, suit: Suit, value: number) {
    super(scene, 0, 0, "img_cards", CARD_BACK_INDEX);
    scene.add.existing(this);

    this.suit = suit;
    this.value = value;

    this.setDisplaySize(CARD_DIMENSIONS.width, CARD_DIMENSIONS.height);
    this.setInteractive({ draggable: false, useHandCursor: true });
  }

  /**
   * Show the face or the back. Only face-up cards can be dragged.
   */
  public setFaceUp(faceUp: boolean): void {
    this.faceUp = faceUp;
    this.setFrame(
      faceUp
        ? SUIT_IMAGE_INDEX[this.suit] * SPRITE_CARD_WIDTH + this.value - 1
        : CARD_BACK_INDEX
    );
    this.scene.input.setDraggable(this, faceUp);
  }

  /**
   * Move the card to a resting place, optionally with a tween. The card flies
   * above other cards and takes its final depth when it lands.
   */
  public moveTo(x: number, y: number, depth: number, animate: boolean): void {
    this.scene.tweens.killTweensOf(this);
    this.setAngle(0);

    if (!animate || (this.x === x && this.y === y)) {
      this.setPosition(x, y).setDepth(depth);
      return;
    }

    // Each new flight draws above earlier ones
    flightOrder = (flightOrder + 1) % FLIGHT_SLOTS;
    this.setDepth(DEPTH.flight + flightOrder);
    this.scene.tweens.add({
      targets: this,
      x,
      y,
      duration: MOVE_DURATION,
      ease: "Quad.easeOut",
      onComplete: () => {
        this.setDepth(depth);
      },
    });
  }

  /**
   * Stop any movement and draw above everything while held by the pointer.
   */
  public lift(index: number): void {
    this.scene.tweens.killTweensOf(this);
    this.setAngle(0).setDepth(DEPTH.drag + index);
  }

  /**
   * Briefly tint the card red to show a rejected move.
   */
  public flash(): void {
    this.setTint(0xff6666);
    this.scene.time.delayedCall(FLASH_DURATION, () => {
      this.clearTint();
    });
  }
}
