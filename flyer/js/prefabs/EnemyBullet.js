var Flyer = Flyer || {};

Flyer.EnemyBullet = function(game, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'enemyBullet');

  this.anchor.setTo(0.5);
  this.scale.setTo(0.5);
  this.checkWorldBounds = true;
  this.outOfBoundsKill = true;

};

Flyer.EnemyBullet.prototype = Object.create(Phaser.Sprite.prototype);
Flyer.EnemyBullet.prototype.constructor = Flyer.EnemyBullet;