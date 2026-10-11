import type * as Phaser from "phaser";

export const FONT_KEY = "PressStart2P";
export const FONT_FILE = "assets/fonts/PressStart2P-Regular.ttf";

/**
 * Press Start 2P is an 8px pixel font, so it is only crisp at multiples of 8.
 */
export const textStyle = (
  size: 8 | 16 | 24,
  color: string
): Phaser.Types.GameObjects.Text.TextStyle => ({
  color,
  fontFamily: FONT_KEY,
  fontSize: `${size}px`,
});
