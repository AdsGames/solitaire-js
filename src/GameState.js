// Imports
import Deck from "./Deck.js";
import Card from "./Card.js";
import Piles from "./Piles.js";

// State
export default class GameState extends Phaser.Scene {
  // Init
  constructor () {
    super({ 
      type: Phaser.AUTO,
      key: 'GameState', 
      active: false,
    });
  }
  
  // Create
  create () {
    // Game state variables
    this.game_number = 1;
    this.score = 0;
    
    // Drag children array
    this.dragChildren = new Array();
    
    // Background
    this.add.image(550 / 2, 0, 'img_background');
    
    // Deck
    this.deck = new Deck(this);
    
    // Text
    this.scoreText = this.add.text(450, 12, '', { fontSize: '16px', fill: '#FFF' });
    this.gameNumText = this.add.text(10, 12, '', { fontSize: '16px', fill: '#FFF' });
    
    // Create zones
    for (var k in Piles.pile_positions){
      if (Piles.pile_positions.hasOwnProperty(k)) {
        // Additional height for tableau
        var addHeight = 0;
        var addWidth = 0;
        if (k.match(/tableau_*/)) {
          addHeight = 100;
        }
        else if (k == 'stock') {
          addWidth = 20;
        }
        
        // Make zone
        var zone = this.add.zone(Piles.pile_positions[k].x + addWidth / 2, Piles.pile_positions[k].y + addHeight / 2, Piles.card_width + addWidth, Piles.card_height + addHeight)
        zone.name = k;
        zone.setRectangleDropZone(Piles.card_width + addWidth, Piles.card_height + addHeight);
        
        // Draw zone
        if (k == 'stock') {
          zone.on('pointerdown', function (pointer) {
            this.drawCard();
          }, this);
          zone.setDepth(99);
        }

        // Drop zone visual
        var graphics = this.add.graphics();
        graphics.lineStyle(1, 0xffffff);
        graphics.strokeRect(zone.x - Piles.card_width / 2 - addWidth / 2, zone.y - Piles.card_height / 2 - addHeight / 2, Piles.card_width, Piles.card_height);
      }
    }
    
    // Start drag card
    this.input.on('dragstart', 
      function (pointer, gameObject, dragX, dragY) {
        if (gameObject instanceof Card) {
          this.dragCardStart(gameObject);
        }
      }, 
      this
    );
    
    // End drag card
    this.input.on('dragend', 
      function (pointer, gameObject, dropped) {
        if (gameObject instanceof Card) {
          this.dragCardEnd();
        }
      }, 
      this
    );
    
    // Drop on pile
    this.input.on('drop', 
      function (pointer, gameObject, dropZone) {
        if (gameObject instanceof Card) {
          this.dropCard(gameObject, dropZone);
        }
      }, 
      this
    );

    // Drag card
    this.input.on('drag', 
      function (pointer, gameObject, dragX, dragY) {
        if (gameObject instanceof Card) {
          this.dragCard(gameObject, dragX, dragY);
        }
      }, 
      this
    );
    
    // Redeal button
    var reDealBack = this.add.graphics();
    reDealBack.fillStyle(0xFFFFFF, 1);
    reDealBack.fillRect(10, 5, 80, 18);
    
    const reDealButton = this.add.text(12, 7, 'Redeal', { fill: '#000' });
    reDealButton.setInteractive();
    reDealButton.on('pointerdown', () => { 
      this.deck.deal(this); 
      this.winText.setVisible(false);
    }, this);
    
    // New deal button
    var newDealBack = this.add.graphics();
    newDealBack.fillStyle(0xFFFFFF, 1);
    newDealBack.fillRect(100, 5, 80, 18);
    
    const newDealButton = this.add.text(102, 7, 'New Deal', { fill: '#000' });
    newDealButton.setInteractive();
    newDealButton.on('pointerdown', () => { 
      this.deck.shuffle(this.deck.cards);
      this.deck.deal(this);
      this.winText.setVisible(false);
    }, this);
    
    // Win text
    this.winText = this.add.text(20, this.cameras.main.height - 40, 'You Win!', { fill: '#FFF', fontSize: '24px' });
    this.winText.setVisible(false);
  }
  
  // Draw card
  drawCard() {
    // Get top card on current stack
    var topCard = this.deck.topCard('stock');
    
    // Empty stack
    if (topCard == undefined) {
      var currentTop = this.deck.topCard('discard');
      var position = 0;

      while (currentTop != undefined) {
        currentTop.reposition('stock', position);
        currentTop.flipBack(this);
        position ++;
        currentTop = this.deck.topCard('discard');
      }
      
      if (position > 0) {
        this.score -= 100;
      }
    }
    else {
      var topCardDisc = this.deck.topCard('discard');
      if (topCardDisc != undefined) {
        topCardDisc.flipBack(this);
        topCard.reposition('discard', topCardDisc.position + 1);
      }
      else {
        topCard.reposition('discard', 0);
      }
      topCard.flip(this);
    }
  }
  
  // Flip score
  flipScore(cardStack) {
    if(cardStack.match(/tableau_*/)) {
      this.score += 5;
    }
  }
  
  // Drop score
  dropScore(zoneStack, cardStack) {
    console.log(" Moved: " + cardStack + " to " + zoneStack);
    
    // Waste to tableau
    if(cardStack == 'discard' && zoneStack.match(/tableau_*/)) { 
      this.score += 5;
    }
    
    // Waste to foundation
    else if(cardStack == 'discard' && zoneStack.match(/foundation_*/)) { 
      this.score += 10;
    }
    
    // Tableau to foundation
    else if(cardStack.match(/tableau_*/) && zoneStack.match(/foundation_*/)) { 
      this.score += 10;
    }

    // Foundation to tableau
    else if(cardStack.match(/foundation_*/) && zoneStack.match(/tableau_*/)) { 
      this.score -= 15;
    }
  }
  
  // Drag card start
  dragCardStart(card) {
    // Populate drag children
    this.dragChildren = [];
    if (card.pile.match(/tableau_*/)) {
      this.dragChildren = this.deck.cardChildren(card);
    }
    else {
      this.dragChildren.push(card);
    }
    
    // Set depths
    for (var i = 0; i < this.dragChildren.length; i++) {
      this.dragChildren[i].setDepth(100 + i);
    }
  }
  
  // Drag card end
  dragCardEnd() {
    // Drop all other cards on top
    for (var i = 0; i < this.dragChildren.length; i++) {
      this.dragChildren[i].reposition(this.dragChildren[i].pile, this.dragChildren[i].position);
    }
  }
  
  // Drag card
  dragCard(card, dragX, dragY) {
    // Set positions
    for (var i = 0; i < this.dragChildren.length; i++) {
      this.dragChildren[i].x  = dragX;
      this.dragChildren[i].y  = dragY + i * 16;
    }
  }
  
  // Drop card
  dropCard(card, dropZone) {
    // Get top card on current stack
    var topCard = this.deck.topCard(dropZone.name);
    
    // Keep old stack name
    var pastStackName = card.pile;
    
    // Empty stack
    if (topCard == undefined) {
      if(dropZone.name.match(/tableau_*/)) {
        if (card.value == 13) {
          this.dropScore(dropZone.name, card.pile);
          card.reposition(dropZone.name, 0);
        }
      }
      else if(dropZone.name.match(/foundation_*/)) {
        if (card.value == 1) {
          this.dropScore(dropZone.name, card.pile);
          card.reposition(dropZone.name, 0);
        }
      }
    }
    
    // Tableau
    else if (dropZone.name.match(/tableau_*/)) {
      if ((card.suit + 1) % 2 == topCard.suit % 2 && 
           card.value == topCard.value - 1) {
        this.dropScore(dropZone.name, card.pile);
        card.reposition(dropZone.name, topCard.position + 1);
      }
    }
    
    // Foundation
    else if (dropZone.name.match(/foundation_*/)) {
      if (card.suit == topCard.suit && 
          card.value == topCard.value + 1) {
        this.dropScore(dropZone.name, card.pile);
        card.reposition(dropZone.name, topCard.position + 1);
      }
    }
    
    // Drop all other cards on top
    for (var i = 0; i < this.dragChildren.length; i++) {
      if (this.dragChildren[i] != card) {
        this.dragChildren[i].reposition(card.pile, card.position + i);
      }
    }
    
    // Flip top card on past stack
    var topCardNew = this.deck.topCard(pastStackName);
    if (topCardNew != undefined && topCardNew != card && !topCardNew.flipped) {
      topCardNew.flip(this);
      this.flipScore(topCardNew.pile);
    }
  }

  // Update
  update() {
    // Ensure score is within range
    if (this.score < 0) {
      this.score = 0;
    }
    
    // Win
    if (this.deck.countCards("foundation_0") + 
        this.deck.countCards("foundation_1") + 
        this.deck.countCards("foundation_2") + 
        this.deck.countCards("foundation_3") == 52) {
      this.winText.setVisible(true);
    }
    
    // Display lives
    this.scoreText.setText("SCORE:" + this.score);
    
    // Display current level
    this.gameNumText.setText('');//"GAME:" + this.game_number);
  }
}