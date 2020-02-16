// Piles class
class Piles {
  // Init
  constructor () {
    this.card_width = 65;
    this.card_height = 100;
    
    this.card_padding = 10;
    
    this.pile_positions = new Array();
    
    this.pile_positions['stock'] = new Phaser.Math.Vector2(45, 85);
    
    this.pile_positions['discard'] = new Phaser.Math.Vector2(145, 85);
    
    for (var i = 0; i < 7; i++) {
      this.pile_positions['tableau_' + i] = new Phaser.Math.Vector2(45 + i * 75, 200);
    }
    
    for (var i = 0; i < 4; i++) {
      this.pile_positions['foundation_' + i] = new Phaser.Math.Vector2(270 + i * 75, 85);
    }
  }
}

export default (new Piles);