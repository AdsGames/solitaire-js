import Card from "./Card";

const NUM_SUITS = 4;
const NUM_VALUES = 14;

export default class Deck {
  public cards: Card[] = [];

  public constructor(scene: Phaser.Scene) {
    for (let i = 0; i < NUM_SUITS; i += 1) {
      for (let t = 1; t < NUM_VALUES; t += 1) {
        this.cards.push(new Card(scene, i, t));
      }
    }

    this.shuffle(this.cards);
    this.deal(scene);
  }

  public deal(scene: Phaser.Scene): void {
    // Flip all back
    this.cards.map((card: Card) => card.flipBack(scene));

    // Set positions
    let x = 0;
    for (let i = 0; i < 7; i += 1) {
      for (let t = 0; t < i + 1; t += 1) {
        this.cards[x].reposition(`tableau_${i}`, t);

        if (i === t) {
          this.cards[x].flip(scene);
        }

        x += 1;
      }
    }

    // Rest go in stack
    for (let i = x; i < 52; i += 1) {
      this.cards[i].reposition("stock", i - x);
    }
  }

  public shuffle(a: Card[]): Card[] {
    for (let i = a.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  public cardChildren(card: Card): Card[] {
    return this.cards
      .flatMap((curr: Card) =>
        curr.pile === card.pile && curr.position >= card.position ? [curr] : []
      )
      .sort((a: Card, b: Card) => a.position - b.position);
  }

  public topCard(pile: string): Card | null {
    return this.cards.reduce<Card|null>((top: Card | null, card: Card) => {
      if (card.pile === pile && (!top || card.position > top.position)) {
        return card;
      }
      return top;
    }, null);
  }

  public countCards(pile: string): number {
    return this.cards.reduce(
      (acc: number, card: Card) => (card.pile === pile ? acc + 1 : acc),
      0
    );
  }
}
