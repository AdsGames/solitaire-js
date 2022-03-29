/* eslint-disable max-lines-per-function */
/* eslint-disable max-lines */
import * as Phaser from "phaser";

import Deck from "./Deck";
import Card from "./Card";
import Piles from "./Piles";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  key: "GameState",
  visible: false,
};

export default class GameState extends Phaser.Scene {
  private score: number = 0;

  private dragChildren: Card[] = [];

  private deck!: Deck;

  private scoreText!: Phaser.GameObjects.Text;

  private gameNumText!: Phaser.GameObjects.Text;

  private winText!: Phaser.GameObjects.Text;

  public constructor() {
    super(sceneConfig);
  }

  public create(): void {
    // Game state variables
    this.score = 0;
    this.dragChildren = [];

    // Add background
    this.add.image(550 / 2, 0, "img_background");

    // Add deck
    this.deck = new Deck(this);

    this.createZones();
    this.createInputListeners();
    this.createButtons();
    this.createText();
  }

  public createZones(): void {
    Object.keys(Piles.pilePositions).forEach((k: string) => {
      // Additional height for tableau
      const addHeight = k.match(/tableau_*/u) ? 100 : 0;
      const addWidth = k === "stock" ? 20 : 0;

      // Make zone
      const zone = this.add
        .zone(
          Piles.pilePositions[k].x + addWidth / 2,
          Piles.pilePositions[k].y + addHeight / 2,
          Piles.cardWidth + addWidth,
          Piles.cardHeight + addHeight
        )
        .setName(k)
        .setRectangleDropZone(
          Piles.cardWidth + addWidth,
          Piles.cardHeight + addHeight
        );

      // Draw zone
      if (k === "stock") {
        zone.on(
          "pointerdown",
          () => {
            this.drawCard();
          },
          this
        );
        zone.setDepth(99);
      }

      // Drop zone visual
      this.add
        .graphics()
        .lineStyle(1, 0xffffff)
        .strokeRect(
          zone.x - Piles.cardWidth / 2 - addWidth / 2,
          zone.y - Piles.cardHeight / 2 - addHeight / 2,
          Piles.cardWidth,
          Piles.cardHeight
        );
    });
  }

  public createInputListeners(): void {
    // Start drag card
    this.input.on(
      "dragstart",
      (
        _pointer: Phaser.Input.Pointer,
        gameObject: Phaser.GameObjects.GameObject
      ) => {
        if (gameObject instanceof Card) {
          this.dragCardStart(gameObject);
        }
      },
      this
    );

    // End drag card
    this.input.on(
      "dragend",
      (
        _pointer: Phaser.Input.Pointer,
        gameObject: Phaser.GameObjects.GameObject
      ) => {
        if (gameObject instanceof Card) {
          this.dragCardEnd();
        }
      },
      this
    );

    // Drop on pile
    this.input.on(
      "drop",
      (
        _pointer: Phaser.Input.Pointer,
        gameObject: Phaser.GameObjects.GameObject,
        dropZone: Phaser.GameObjects.GameObject
      ) => {
        if (gameObject instanceof Card) {
          this.dropCard(gameObject, dropZone);
        }
      },
      this
    );

    // Drag card
    this.input.on(
      "drag",
      (
        _pointer: Phaser.Input.Pointer,
        gameObject: Phaser.GameObjects.GameObject,
        dragX: number,
        dragY: number
      ) => {
        if (gameObject instanceof Card) {
          this.dragCard(gameObject, dragX, dragY);
        }
      },
      this
    );
  }

  public createButtons(): void {
    // Redeal button
    this.add.graphics().fillStyle(0xffffff, 1).fillRect(10, 5, 80, 18);

    this.add
      .text(12, 7, "Redeal", { color: "#000" })
      .setInteractive()
      .on(
        "pointerdown",
        () => {
          this.deck.deal(this);
          this.winText.setVisible(false);
        },
        this
      );

    // New deal button
    this.add.graphics().fillStyle(0xffffff, 1).fillRect(100, 5, 80, 18);

    this.add
      .text(102, 7, "New Deal", { color: "#000" })
      .setInteractive()
      .on(
        "pointerdown",
        () => {
          this.deck.shuffle(this.deck.cards);
          this.deck.deal(this);
          this.winText.setVisible(false);
          this.score = 0;
        },
        this
      );
  }

  public createText(): void {
    this.scoreText = this.add.text(450, 12, "", {
      color: "#FFF",
      fontSize: "16px",
    });

    this.gameNumText = this.add.text(10, 12, "", {
      color: "#FFF",
      fontSize: "16px",
    });

    this.winText = this.add
      .text(20, this.cameras.main.height - 40, "You Win!", {
        color: "#FFF",
        fontSize: "24px",
      })
      .setVisible(false);
  }

  public drawCard(): void {
    // Get top card on current stack
    const topCard = this.deck.topCard("stock");

    // Empty stack
    if (topCard) {
      const topCardDisc = this.deck.topCard("discard");
      if (topCardDisc) {
        topCardDisc.flipBack(this);
        topCard.reposition("discard", topCardDisc.position + 1);
      } else {
        topCard.reposition("discard", 0);
      }
      topCard.flip(this);
    } else {
      let currentTop = this.deck.topCard("discard");
      let position = 0;

      while (currentTop) {
        currentTop.reposition("stock", position);
        currentTop.flipBack(this);
        position += 1;
        currentTop = this.deck.topCard("discard");
      }

      if (position > 0) {
        this.score -= 100;
      }
    }
  }

  public flipScore(cardStack: string): void {
    if (cardStack.match(/tableau_*/u)) {
      this.score += 5;
    }
  }

  public dropScore(zoneStack: string, cardStack: string): void {
    // Waste to tableau
    if (cardStack === "discard" && zoneStack.match(/tableau_*/u)) {
      this.score += 5;
    }

    // Waste to foundation
    else if (cardStack === "discard" && zoneStack.match(/foundation_*/u)) {
      this.score += 10;
    }

    // Tableau to foundation
    else if (
      cardStack.match(/tableau_*/u) &&
      zoneStack.match(/foundation_*/u)
    ) {
      this.score += 10;
    }

    // Foundation to tableau
    else if (
      cardStack.match(/foundation_*/u) &&
      zoneStack.match(/tableau_*/u)
    ) {
      this.score -= 15;
    }
  }

  public dragCardStart(card: Card): void {
    // Populate drag children
    this.dragChildren = [];
    if (card.pile.match(/tableau_*/u)) {
      this.dragChildren = this.deck.cardChildren(card);
    } else {
      this.dragChildren.push(card);
    }

    // Set depths
    for (let i = 0; i < this.dragChildren.length; i += 1) {
      this.dragChildren[i].setDepth(100 + i);
    }
  }

  public dragCardEnd(): void {
    // Drop all other cards on top
    this.dragChildren.forEach((child: Card) => {
      child.reposition(child.pile, child.position);
    });
  }

  public dragCard(_card: Card, dragX: number, dragY: number): void {
    // Set positions
    for (let i = 0; i < this.dragChildren.length; i += 1) {
      this.dragChildren[i].x = dragX;
      this.dragChildren[i].y = dragY + i * 16;
    }
  }

  // eslint-disable-next-line
  public dropCard(card: Card, dropZone: Phaser.GameObjects.GameObject): void {
    // Get top card on current stack
    const topCard = this.deck.topCard(dropZone.name);
    const cardPile = card.pile;

    // Empty stack
    if (!topCard) {
      if (dropZone.name.match(/tableau_*/u)) {
        if (card.value === 13) {
          this.dropScore(dropZone.name, card.pile);
          card.reposition(dropZone.name, 0);
        }
      } else if (dropZone.name.match(/foundation_*/u)) {
        if (card.value === 1) {
          this.dropScore(dropZone.name, card.pile);
          card.reposition(dropZone.name, 0);
        }
      }
    }

    // Tableau
    else if (dropZone.name.match(/tableau_*/u)) {
      if (
        (card.suit + 1) % 2 === topCard.suit % 2 &&
        card.value === topCard.value - 1
      ) {
        this.dropScore(dropZone.name, card.pile);
        card.reposition(dropZone.name, topCard.position + 1);
      }
    }

    // Foundation
    else if (dropZone.name.match(/foundation_*/u)) {
      if (card.suit === topCard.suit && card.value === topCard.value + 1) {
        this.dropScore(dropZone.name, card.pile);
        card.reposition(dropZone.name, topCard.position + 1);
      }
    }

    // Drop all other cards on top

    for (let i = 1; i < this.dragChildren.length; i += 1) {
      this.dragChildren[i].reposition(card.pile, card.position + i);
    }

    // Flip top card on past stack
    const topCardNew = this.deck.topCard(cardPile);
    if (topCardNew && topCardNew !== card && !topCardNew.flipped) {
      topCardNew.flip(this);
      this.flipScore(topCardNew.pile);
    }
  }

  public update(): void {
    // Ensure score is within range
    if (this.score < 0) {
      this.score = 0;
    }

    // Win
    if (
      this.deck.countCards("foundation_0") +
        this.deck.countCards("foundation_1") +
        this.deck.countCards("foundation_2") +
        this.deck.countCards("foundation_3") ===
      52
    ) {
      this.winText.setVisible(true);
    }

    // Display lives
    this.scoreText.setText(`SCORE: ${this.score}`);

    // Display current level
    this.gameNumText.setText("");
  }
}
