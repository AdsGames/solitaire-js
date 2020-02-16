// Menu state
export default class MenuState extends Phaser.Scene {
  // Init
  constructor () {
    super({ key: 'MenuState', active: false });
  }
  
  // Preload
  preload () {
    
  }
  
  // Create
  create () {
    // Background
    this.add.image(550 / 2, 400 / 2, 'img_background');
    
    // Title
    this.add.image(550 / 2, 100, 'img_title');
    
    // Play button
    var button_play = this.add.sprite(550 / 2, 220, 'img_button_start');
    button_play.setInteractive();
    button_play.on('pointerdown', function (event) { 
      this.scene.start('GameState');
    }, this);
    
    // Help button
    var button_help = this.add.sprite(550 / 2, 310, 'img_button_help');
    button_help.setInteractive();
    button_help.on('pointerdown', function (event) { 
      this.scene.start('HelpState');
    }, this);
  }
}