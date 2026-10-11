import * as Phaser from "phaser";

import { DEPTH } from "./constants/depth";
import { textStyle } from "./constants/font";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "./constants/screen";

const BUTTON_Y = 6;
const BUTTON_HEIGHT = 26;
const BUTTON_PADDING = 4;
const BUTTON_FONT_SIZE = 16;
const BUTTON_COLOUR = 0xffffff;
const BUTTON_HOVER_COLOUR = 0xffdd66;

/** Space between buttons. The tap area of each button fills half of it. */
export const BUTTON_GAP = 8;

/** Extra tap area above and below a button, for fingers */
const TOUCH_SLOP_Y = 6;

export interface Button {
  label: Phaser.GameObjects.Text;
  width: number;
}

/**
 * White button with a centred label, sized to fit `label`. The tap area is
 * larger than the box so it is easy to hit on a touch screen.
 */
export const createButton = (
  scene: Phaser.Scene,
  x: number,
  label: string,
  onClick: () => void
): Button => {
  const width = label.length * BUTTON_FONT_SIZE + 2 * BUTTON_PADDING;
  const hitArea = new Phaser.Geom.Rectangle(
    -BUTTON_GAP / 2,
    -TOUCH_SLOP_Y,
    width + BUTTON_GAP,
    BUTTON_HEIGHT + 2 * TOUCH_SLOP_Y
  );

  const box = scene.add
    .rectangle(x, BUTTON_Y, width, BUTTON_HEIGHT, BUTTON_COLOUR)
    .setOrigin(0)
    .setDepth(DEPTH.button)
    .setInteractive({
      hitArea,
      hitAreaCallback: (area: Phaser.Geom.Rectangle, px: number, py: number) =>
        area.contains(px, py),
      useHandCursor: true,
    });

  const reset = (): void => {
    box.setFillStyle(BUTTON_COLOUR);
  };

  box
    .on("pointerover", () => box.setFillStyle(BUTTON_HOVER_COLOUR))
    .on("pointerout", reset)
    .on("pointerdown", onClick)
    // A touch has no "out" event, so clear the highlight on release
    .on("pointerup", (pointer: Phaser.Input.Pointer) => {
      if (pointer.wasTouch) {
        reset();
      }
    });

  const text = scene.add
    .text(
      x + width / 2,
      BUTTON_Y + BUTTON_HEIGHT / 2,
      label,
      textStyle(BUTTON_FONT_SIZE, "#000")
    )
    .setOrigin(0.5)
    .setDepth(DEPTH.button + 1);

  return { label: text, width };
};

/**
 * Centred message box with a title and body text. Click to close.
 */
export class Panel {
  private readonly container: Phaser.GameObjects.Container;

  private readonly title: Phaser.GameObjects.Text;

  private readonly body: Phaser.GameObjects.Text;

  public constructor(scene: Phaser.Scene) {
    const background = scene.add
      .rectangle(0, 0, 480, 176, 0x000000, 0.85)
      .setStrokeStyle(2, 0xffffff)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.hide();
      });

    this.title = scene.add
      .text(0, -48, "", textStyle(24, "#FFF"))
      .setOrigin(0.5);

    this.body = scene.add
      .text(0, 24, "", { ...textStyle(16, "#FFF"), align: "center" })
      .setLineSpacing(8)
      .setOrigin(0.5);

    this.container = scene.add
      .container(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, [
        background,
        this.title,
        this.body,
      ])
      .setDepth(DEPTH.panel)
      .setVisible(false);
  }

  public show(title: string, lines: readonly string[]): void {
    this.title.setText(title);
    this.body.setText(lines.join("\n"));
    this.container.setVisible(true);
  }

  public hide(): void {
    this.container.setVisible(false);
  }
}

/**
 * Win animation: cards fall off the foundations, kings first.
 */
export const cascade = (
  scene: Phaser.Scene,
  cards: readonly Phaser.GameObjects.Sprite[] & readonly { value: number }[]
): void => {
  [...cards]
    .toSorted((a, b) => b.value - a.value)
    .forEach((card, i) => {
      scene.tweens.add({
        targets: card,
        x: Phaser.Math.Between(0, SCREEN_WIDTH),
        y: SCREEN_HEIGHT + 100,
        angle: Phaser.Math.Between(-180, 180),
        delay: 400 + i * 40,
        duration: 1200,
        ease: "Quad.easeIn",
      });
    });
};

/**
 * Centred multi-line status text, such as score and time.
 */
export const createStatusText = (
  scene: Phaser.Scene,
  x: number,
  y: number
): Phaser.GameObjects.Text =>
  scene.add
    .text(x, y, "", { ...textStyle(16, "#FFF"), align: "center" })
    .setLineSpacing(8)
    .setOrigin(0.5);
