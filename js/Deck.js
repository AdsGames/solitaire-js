import Card from "./Card.js";
import Piles from "./Piles.js";

// Deck class
export default class Deck {
  // Init
  constructor (scene) {
    // Create cards array
    this.cards = new Array();
    
    // Populate
    // 4 suits
    for (var i = 0; i < 4; i++) { 
      // 13 values
      for (var t = 1; t < 14; t++) { 
        this.cards.push(new Card(scene, i, t));
      }
    }
    
    // Shuffle
    this.shuffle(this.cards);
    
    // Deal
    this.deal(scene);
  }
  
  // Deal cards
  deal(scene) {
    // Flip all back
    this.cards.map(card => card.flipBack(scene));

    // Set positions
    var x = 0;
    for (var i = 0; i < 7; i++) { 
      for (var t = 0; t < i + 1; t++) { 
        this.cards[x].reposition('tableau_' + i, t);
        
        if (i == t) {
          this.cards[x].flip(scene);
        }
        
        x++;
      }
    }
    
    // Rest go in stack
    for (var i = x; i < 52; i++) { 
      this.cards[i].reposition('stock', i - x);
    }
  }
  
  // Shuffle cards
  shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  
  // Get children of card
  cardChildren(card) {
    var childrenArray = new Array();
    for (var i = 0; i < this.cards.length; i++) { 
      if (this.cards[i].pile == card.pile && this.cards[i].position >= card.position) {
        childrenArray.push(this.cards[i]);
      }
    }
    
    childrenArray.sort(
      function(a, b) {
        return (a.position < b.position) ? -1 : (a.position > b.position) ? 1 : 0
      }
    );
    
    return childrenArray;
  }
  
  // Get top card of pile
  topCard(pile) {
    var currentTop = -1;
    for (var i = 0; i < this.cards.length; i++) { 
      if (this.cards[i].pile == pile && (currentTop == -1 || this.cards[i].position > this.cards[currentTop].position)) {
        currentTop = i;
      }
    }
    return this.cards[currentTop];
  }
  
  // Count cards on pile
  countCards(pile) {
    var count = 0;
    for (var i = 0; i < this.cards.length; i++) { 
      if (this.cards[i].pile == pile) {
        count ++;
      }
    }
    return count;
  }
}