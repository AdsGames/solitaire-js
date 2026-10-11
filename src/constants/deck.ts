/**
 * Suits
 */
export enum Suit {
  Clubs = "CLUBS",
  Diamonds = "DIAMONDS",
  Hearts = "HEARTS",
  Spades = "SPADES",
}

/**
 * Color map
 */
export enum SuitColor {
  Red = "RED",
  Black = "BLACK",
}

/**
 * Defines sprite offset of each suit in the spritemap.
 */
export const SUIT_IMAGE_INDEX = {
  [Suit.Hearts]: 0,
  [Suit.Diamonds]: 1,
  [Suit.Clubs]: 2,
  [Suit.Spades]: 3,
} as const;

/**
 * Defines suit colors
 */
export const SUIT_COLOR = {
  [Suit.Hearts]: SuitColor.Red,
  [Suit.Diamonds]: SuitColor.Red,
  [Suit.Clubs]: SuitColor.Black,
  [Suit.Spades]: SuitColor.Black,
} as const;

/**
 * Deck dimensions
 */
export const CARD_DIMENSIONS = {
  height: 120,
  width: 84,
};

/**
 * Corner radius of the card art (2 sprite pixels at 2x scale)
 */
export const CARD_CORNER_RADIUS = 4;

export const NUM_CARDS = 52;
export const NUM_SUITS = 4;
export const NUM_VALUES = 13;

export const SPRITE_CARD_WIDTH = 14;
export const CARD_BACK_INDEX = 27;

/** Vertical spacing of face-up and face-down cards in a tableau column */
export const STACK_OFFSET = 26;
export const FACE_DOWN_OFFSET = 12;
export const STACK_DRAG_OFFSET = 30;

/**
 * Lowest point the bottom edge of a tableau card may reach
 */
export const TABLEAU_BOTTOM = 600;
