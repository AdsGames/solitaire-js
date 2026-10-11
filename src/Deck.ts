import type * as Phaser from "phaser";
import Card from "./Card";
import {
  CARD_DIMENSIONS,
  FACE_DOWN_OFFSET,
  NUM_VALUES,
  STACK_OFFSET,
  SUIT_COLOR,
  Suit,
  TABLEAU_BOTTOM,
} from "./constants/deck";
import { DEPTH } from "./constants/depth";
import {
  ALL_PILES,
  FOUNDATION_PILES,
  PILE_POSITIONS,
  PileId,
  TABLEAU_PILES,
} from "./constants/table";
import { dealOrder } from "./deal";
import { canStack, isSequence } from "./rules";

export interface Snapshot {
  piles: ReadonlyMap<PileId, readonly Card[]>;
  faceUp: ReadonlySet<Card>;
}

export interface Move {
  cards: Card[];
  from: PileId;
  to: PileId;
  /** Tableau card turned face up by the move, if any */
  turned: Card | null;
}

const isTableau = (pile: PileId): boolean => TABLEAU_PILES.includes(pile);
const isFoundation = (pile: PileId): boolean => FOUNDATION_PILES.includes(pile);

/**
 * Score for a move, using standard Windows Klondike scoring.
 */
export const scoreMove = ({ from, to, turned }: Move): number => {
  let score = turned === null ? 0 : 5;
  if (from === PileId.Waste && isTableau(to)) {
    score += 5;
  } else if (!isFoundation(from) && isFoundation(to)) {
    score += 10;
  } else if (isFoundation(from) && isTableau(to)) {
    score -= 15;
  }
  return score;
};

/** Score for turning the waste back into the stock */
export const RECYCLE_SCORE = -100;

/**
 * Board state: which cards are in which pile, and the rules for moving them.
 */
export default class Deck {
  public readonly cards: Card[] = [];

  private piles = new Map<PileId, Card[]>();

  public constructor(scene: Phaser.Scene) {
    for (let value = 1; value <= NUM_VALUES; value += 1) {
      Object.values(Suit).forEach((suit) => {
        this.cards.push(new Card(scene, suit, value));
      });
    }
  }

  /**
   * Deal row by row: column i gets i + 1 cards with the last face up. The
   * rest form the stock.
   */
  public deal(dealNumber: number): void {
    this.piles = new Map(ALL_PILES.map((pile) => [pile, []]));

    const order = dealOrder(dealNumber).flatMap(({ suit, value }) =>
      this.cards.filter((c) => c.suit === suit && c.value === value)
    );

    TABLEAU_PILES.forEach((_, row) => {
      for (let col = row; col < TABLEAU_PILES.length; col += 1) {
        const card = order.shift();
        if (card !== undefined) {
          card.setFaceUp(col === row);
          this.cardsIn(TABLEAU_PILES[col]).push(card);
        }
      }
    });

    order.forEach((card) => {
      card.setFaceUp(false);
    });
    this.cardsIn(PileId.Stock).push(...order);
  }

  public snapshot(): Snapshot {
    return {
      piles: new Map(ALL_PILES.map((pile) => [pile, [...this.cardsIn(pile)]])),
      faceUp: new Set(this.cards.filter((card) => card.faceUp)),
    };
  }

  public restore({ piles, faceUp }: Snapshot): void {
    this.piles = new Map(
      ALL_PILES.map((pile) => [pile, [...(piles.get(pile) ?? [])]])
    );
    this.cards.forEach((card) => {
      card.setFaceUp(faceUp.has(card));
    });
  }

  public pileOf(card: Card): PileId {
    return (
      ALL_PILES.find((pile) => this.cardsIn(pile).includes(card)) ??
      ALL_PILES[0]
    );
  }

  public top(pile: PileId): Card | undefined {
    return this.cardsIn(pile).at(-1);
  }

  public isEmpty(pile: PileId): boolean {
    return this.cardsIn(pile).length === 0;
  }

  public isWon(): boolean {
    return FOUNDATION_PILES.every(
      (pile) => this.cardsIn(pile).length === NUM_VALUES
    );
  }

  /**
   * Cards that move together when the player picks up `card`, or null when the
   * card cannot be picked up. Only the top card of the waste and foundations
   * can move.
   */
  public pickUp(card: Card): Card[] | null {
    const pile = this.pileOf(card);
    if (!card.faceUp || pile === PileId.Stock) {
      return null;
    }

    if (!isTableau(pile)) {
      return this.top(pile) === card ? [card] : null;
    }

    const cards = this.cardsIn(pile).slice(this.cardsIn(pile).indexOf(card));
    return isSequence(cards) ? cards : null;
  }

  public canMove(cards: readonly Card[], to: PileId): boolean {
    if (cards.length === 0 || this.pileOf(cards[0]) === to) {
      return false;
    }

    if (isFoundation(to)) {
      return cards.length === 1 && this.foundationFor(cards[0]) === to;
    }

    if (!isTableau(to)) {
      return false;
    }

    const target = this.top(to);
    if (target === undefined) {
      return cards[0].value === NUM_VALUES;
    }

    return target.faceUp && canStack(target, cards[0]);
  }

  /**
   * Move cards, then turn up the card they uncover in a tableau column.
   */
  public move(cards: readonly Card[], to: PileId): Move {
    const from = this.pileOf(cards[0]);
    this.piles.set(
      from,
      this.cardsIn(from).filter((c) => !cards.includes(c))
    );
    this.cardsIn(to).push(...cards);

    const uncovered = this.top(from);
    let turned: Card | null = null;
    if (isTableau(from) && uncovered !== undefined && !uncovered.faceUp) {
      uncovered.setFaceUp(true);
      turned = uncovered;
    }

    return { cards: [...cards], from, to, turned };
  }

  /**
   * Turn the top stock card onto the waste. With an empty stock, turn the
   * waste back over into the stock. Returns null when both are empty.
   */
  public draw(): "draw" | "recycle" | null {
    const card = this.cardsIn(PileId.Stock).pop();
    if (card !== undefined) {
      card.setFaceUp(true);
      this.cardsIn(PileId.Waste).push(card);
      return "draw";
    }

    const waste = this.cardsIn(PileId.Waste).toReversed();
    if (waste.length === 0) {
      return null;
    }

    waste.forEach((c) => {
      c.setFaceUp(false);
    });
    this.piles.set(PileId.Stock, waste);
    this.piles.set(PileId.Waste, []);
    return "recycle";
  }

  /**
   * Best move for a tap or double-click on `card`: to a foundation, then onto
   * a tableau card, then to an empty column. Moving a king that already starts
   * its column to an empty column is skipped as pointless.
   */
  public quickMove(card: Card): { cards: Card[]; to: PileId } | null {
    const cards = this.pickUp(card);
    if (cards === null) {
      return null;
    }

    const from = this.pileOf(card);
    const wholeColumn =
      isTableau(from) && cards.length === this.cardsIn(from).length;
    const emptyColumns = TABLEAU_PILES.filter((p) => this.isEmpty(p));

    const to = [
      ...FOUNDATION_PILES,
      ...TABLEAU_PILES.filter((p) => !this.isEmpty(p)),
      ...(wholeColumn ? [] : emptyColumns),
    ].find((pile) => this.canMove(cards, pile));

    return to === undefined ? null : { cards, to };
  }

  /**
   * Foundation pile that accepts `card` next, or null.
   */
  public foundationFor(card: Card): PileId | null {
    const match = FOUNDATION_PILES.find((pile) => {
      const top = this.top(pile);
      return top?.suit === card.suit && top.value === card.value - 1;
    });
    if (match !== undefined) {
      return match;
    }

    if (card.value === 1) {
      return FOUNDATION_PILES.find((pile) => this.isEmpty(pile)) ?? null;
    }

    return null;
  }

  /**
   * Next card to play to a foundation automatically. A card is safe when both
   * foundations of the opposite colour hold at least `value - 1` cards. Once
   * every card is face up and the stock and waste are empty, the game finishes
   * itself.
   */
  public nextAutoMove(): { card: Card; to: PileId } | null {
    const finishing = this.isSolved();

    for (const pile of [PileId.Waste, ...TABLEAU_PILES]) {
      const card = this.top(pile);
      const to = card === undefined ? null : this.foundationFor(card);
      if (
        card !== undefined &&
        to !== null &&
        (finishing || this.isSafeToPlay(card))
      ) {
        return { card, to };
      }
    }

    return null;
  }

  /**
   * False when no useful move is left. Draw-one with unlimited redeals lets
   * every stock and waste card reach the top, so each one counts. Tableau
   * moves count only when they turn a card, empty a column for a king, or go
   * to a foundation. Moving a run between two equal cards does not count.
   */
  public hasMoves(): boolean {
    const reserve = [
      ...this.cardsIn(PileId.Stock),
      ...this.cardsIn(PileId.Waste),
    ];
    if (reserve.some((card) => this.canPlaySingle(card))) {
      return true;
    }

    return TABLEAU_PILES.some((from) => {
      const cards = this.cardsIn(from);
      return cards.some((card, i) => {
        if (!card.faceUp) {
          return false;
        }
        if (i === cards.length - 1 && this.foundationFor(card) !== null) {
          return true;
        }

        const useful =
          i === 0 ? card.value !== NUM_VALUES : !cards[i - 1].faceUp;
        const run = cards.slice(i);
        return (
          useful &&
          isSequence(run) &&
          TABLEAU_PILES.some((to) => this.canMove(run, to))
        );
      });
    });
  }

  /**
   * Position every card in `pile`. Long tableau columns squeeze together so
   * the last card stays on screen.
   */
  public layout(pile: PileId, animate: boolean): void {
    const cards = this.cardsIn(pile);
    const { x, y } = PILE_POSITIONS[pile];

    if (!isTableau(pile)) {
      cards.forEach((card, i) => {
        card.moveTo(x, y, DEPTH.card + i, animate);
      });
      return;
    }

    const gaps = cards.map((card) =>
      card.faceUp ? STACK_OFFSET : FACE_DOWN_OFFSET
    );
    const room = TABLEAU_BOTTOM - CARD_DIMENSIONS.height / 2 - y;
    const natural = gaps.slice(0, -1).reduce((sum, gap) => sum + gap, 0);
    const scale = natural > room ? room / natural : 1;

    let offset = 0;
    cards.forEach((card, i) => {
      card.moveTo(x, y + Math.floor(offset), DEPTH.card + i, animate);
      offset += gaps[i] * scale;
    });
  }

  public layoutAll(animate: boolean): void {
    ALL_PILES.forEach((pile) => {
      this.layout(pile, animate);
    });
  }

  private cardsIn(pile: PileId): Card[] {
    let cards = this.piles.get(pile);
    if (cards === undefined) {
      cards = [];
      this.piles.set(pile, cards);
    }
    return cards;
  }

  private canPlaySingle(card: Card): boolean {
    return (
      this.foundationFor(card) !== null ||
      TABLEAU_PILES.some((to) => this.canMove([card], to))
    );
  }

  private isSolved(): boolean {
    return (
      this.isEmpty(PileId.Stock) &&
      this.isEmpty(PileId.Waste) &&
      this.cards.every((card) => card.faceUp)
    );
  }

  private foundationLevel(suit: Suit): number {
    const pile = FOUNDATION_PILES.find(
      (p) => this.cardsIn(p)[0]?.suit === suit
    );
    return pile === undefined ? 0 : this.cardsIn(pile).length;
  }

  private isSafeToPlay(card: Card): boolean {
    if (card.value <= 2) {
      return true;
    }

    return Object.values(Suit)
      .filter((suit) => SUIT_COLOR[suit] !== SUIT_COLOR[card.suit])
      .every((suit) => this.foundationLevel(suit) >= card.value - 1);
  }
}
