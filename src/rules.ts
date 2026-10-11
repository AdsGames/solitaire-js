import { SUIT_COLOR, type Suit } from "./constants/deck";

export interface CardValue {
  suit: Suit;
  value: number;
}

/**
 * True when `upper` can sit on `lower` in a tableau column.
 */
export const canStack = (lower: CardValue, upper: CardValue): boolean =>
  SUIT_COLOR[lower.suit] !== SUIT_COLOR[upper.suit] &&
  upper.value === lower.value - 1;

/**
 * True when every card in `cards` can sit on the card before it.
 */
export const isSequence = (cards: readonly CardValue[]): boolean =>
  cards.every((card, i) => i === 0 || canStack(cards[i - 1], card));
