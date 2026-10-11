import * as Phaser from "phaser";

import { CARD_DIMENSIONS } from "./deck";
import { SCREEN_WIDTH } from "./screen";

/**
 * Define the constants for the table.
 */
export enum PileId {
  Stock = "STOCK",
  Waste = "WASTE",
  Tableau1 = "TABLEAU_1",
  Tableau2 = "TABLEAU_2",
  Tableau3 = "TABLEAU_3",
  Tableau4 = "TABLEAU_4",
  Tableau5 = "TABLEAU_5",
  Tableau6 = "TABLEAU_6",
  Tableau7 = "TABLEAU_7",
  Foundation1 = "FOUNDATION_1",
  Foundation2 = "FOUNDATION_2",
  Foundation3 = "FOUNDATION_3",
  Foundation4 = "FOUNDATION_4",
}

/**
 * Define tableau piles
 */
export const TABLEAU_PILES = [
  PileId.Tableau1,
  PileId.Tableau2,
  PileId.Tableau3,
  PileId.Tableau4,
  PileId.Tableau5,
  PileId.Tableau6,
  PileId.Tableau7,
];

/**
 * Define foundation piles
 */
export const FOUNDATION_PILES = [
  PileId.Foundation1,
  PileId.Foundation2,
  PileId.Foundation3,
  PileId.Foundation4,
];

export const ALL_PILES = [
  PileId.Stock,
  PileId.Waste,
  ...TABLEAU_PILES,
  ...FOUNDATION_PILES,
];

/**
 * The 7 tableau columns are centred on screen. Stock and waste sit above
 * columns 1-2 and foundations above columns 4-7. Column 3 of the top row
 * holds the score.
 */
const COLUMN_SPACING = CARD_DIMENSIONS.width + 10;
const TABLE_WIDTH = 6 * COLUMN_SPACING + CARD_DIMENSIONS.width;

export const TABLE_LEFT = (SCREEN_WIDTH - TABLE_WIDTH) / 2;

export const TOP_ROW_Y = 100;
const TABLEAU_Y = 240;

export const columnX = (i: number): number =>
  TABLE_LEFT + CARD_DIMENSIONS.width / 2 + i * COLUMN_SPACING;

const at = (i: number, y: number): Phaser.Math.Vector2 =>
  new Phaser.Math.Vector2(columnX(i), y);

/**
 * Positions of piles on screen
 */
export const PILE_POSITIONS: Record<PileId, Phaser.Math.Vector2> = {
  [PileId.Stock]: at(0, TOP_ROW_Y),
  [PileId.Waste]: at(1, TOP_ROW_Y),

  [PileId.Foundation1]: at(3, TOP_ROW_Y),
  [PileId.Foundation2]: at(4, TOP_ROW_Y),
  [PileId.Foundation3]: at(5, TOP_ROW_Y),
  [PileId.Foundation4]: at(6, TOP_ROW_Y),

  [PileId.Tableau1]: at(0, TABLEAU_Y),
  [PileId.Tableau2]: at(1, TABLEAU_Y),
  [PileId.Tableau3]: at(2, TABLEAU_Y),
  [PileId.Tableau4]: at(3, TABLEAU_Y),
  [PileId.Tableau5]: at(4, TABLEAU_Y),
  [PileId.Tableau6]: at(5, TABLEAU_Y),
  [PileId.Tableau7]: at(6, TABLEAU_Y),
};
