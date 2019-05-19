var Flyer = Flyer || {};

Flyer.PlayerBullet = function(game, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'playerBullet');
  
  this.anchor.setTo(0.5);
  this.checkWorldBounds = true;
  this.outOfBoundsKill = true;
};

Flyer.PlayerBullet.prototype = Object.create(Phaser.Sprite.prototype);
Flyer.PlayerBullet.prototype.constructor = Flyer.PlayerBullet;