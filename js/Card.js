import Piles from "./Piles.js";

// Card class
export default class Card extends Phaser.GameObjects.Sprite {
  // Init
  constructor (scene, suit, value) {
    // Create sprite
    super(scene, 0, 0, 'img_card_back_green');
    scene.add.existing(this);
    
    // Suit and Value
    this.suit = suit;
    this.value = value;
    
    this.pile = 'none';
    this.position = -1;
    
    this.flipped = false;
    
    // Width and Height
    this.setDisplaySize(Piles.card_width, Piles.card_height);
    
    // Click event
    this.setInteractive();
  }
  
  // Reposition
  reposition(pile, position) {
    this.pile = pile;
    this.position = position;
    
    this.setDepth(this.position + 10);
    
    if (this.pile == 'stock' || this.pile == 'discard') {
      this.setPosition(Piles.pile_positions[this.pile].x + position, Piles.pile_positions[this.pile].y);
    }
    else if(this.pile.match(/tableau_*/)) {
      this.setPosition(Piles.pile_positions[this.pile].x, Piles.pile_positions[this.pile].y + position * 10);
    }
    else if(this.pile.match(/foundation_*/)) {
      this.setPosition(Piles.pile_positions[this.pile].x, Piles.pile_positions[this.pile].y);
    }
  }
  
  // Flip
  flip(scene) {
    // Select image
    this.setTexture(this.selectImage(this.suit, this.value));
    scene.input.setDraggable(this);
    this.flipped = true;
  }
  
  // Flip back
  flipBack(scene) {
    this.setTexture('img_card_back_green');
    scene.input.setDraggable(this, false);
    this.flipped = false;
  }
  
  // Select image
  selectImage(suit, value) {
    return 'img_card_' + value + '_' + suit;
  }
}