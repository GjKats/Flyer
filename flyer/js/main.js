var Flyer = Flyer || {};
Flyer.game = new Phaser.Game(500, 700, Phaser.AUTO, '');
Flyer.game.state.add('GameState', Flyer.GameState);
Flyer.game.state.start('GameState');
var score = 0;











