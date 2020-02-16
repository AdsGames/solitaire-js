import Card from "./Card.js";

const NUM_SUITS = 4;
const NUM_VALUES = 14;

export default class Deck {
  constructor(scene) {
    this.cards = [];

    for (let i = 0; i < NUM_SUITS; i += 1) {
      for (let t = 1; t < NUM_VALUES; t += 1) {
        this.cards.push(new Card(scene, i, t));
      }
    }

    this.shuffle(this.cards);
    this.deal(scene);
  }

  deal(scene) {
    // Flip all back
    this.cards.map(card => card.flipBack(scene));

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

  shuffle(a) {
    for (let i = a.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  cardChildren(card) {
    const childrenArray = [];
    for (let i = 0; i < this.cards.length; i += 1) {
      if (
        this.cards[i].pile === card.pile &&
        this.cards[i].position >= card.position
      ) {
        childrenArray.push(this.cards[i]);
      }
    }

    childrenArray.sort((a, b) => a.position - b.position);

    return childrenArray;
  }

  topCard(pile) {
    let currentTop = -1;
    for (let i = 0; i < this.cards.length; i += 1) {
      if (
        this.cards[i].pile === pile &&
        (currentTop === -1 ||
          this.cards[i].position > this.cards[currentTop].position)
      ) {
        currentTop = i;
      }
    }
    return this.cards[currentTop];
  }

  countCards(pile) {
    let count = 0;
    for (let i = 0; i < this.cards.length; i += 1) {
      if (this.cards[i].pile === pile) {
        count += 1;
      }
    }
    return count;
  }
}
