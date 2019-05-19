var Flyer = Flyer || {};

Flyer.Enemy =  function(game, x, y, key, health, enemyBullets){
  Phaser.Sprite.call(this, game, x, y, key);
  
  this.game = game;
  
  this.game.physics.arcade.enable(this);
  
  this.anchor.setTo(0.5);
  this.health = health;
  this.scale.setTo(0.2);
  
  this.enemyBullets = enemyBullets;
  
  this.enemyTimer = this.game.time.create(false);
  this.enemyTimer.start();
  
  this.scheduleShooting();

};

Flyer.Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Flyer.Enemy.prototype.constructor = Flyer.Enemy;

Flyer.Enemy.prototype.update = function() {
  if(this.x < 0.05 * this.game.world.width){
    this.x = 0.05 * this.game.world.width + 2;
    this.body.velocity.x *= -1;
  }
  else if(this.x > 0.95 * this.game.world.width){
    this.x = 0.95 * this.game.world.width - 2;
    this.body.velocity.x *= -1
  }
  if(this.position.y > this.game.world.height){
    this.kill();
  }
};


Flyer.Enemy.prototype.damage = function(amount){
  Phaser.Sprite.prototype.damage.call(this, amount);
  
  if(this.health <= 0){
    var emitter = this.game.add.emitter(this.x, this.y, 100);
    emitter.makeParticles('enemyParticle');
    emitter.minParticleSpeed.setTo(-200, -200);
    emitter.maxParticleSpeed.setTo(200, 200);
    emitter.gravity = 0;
    emitter.start(true, 500, null, 100);
    this.enemyTimer.pause();
  }
};

Flyer.Enemy.prototype.reset = function(x, y, health, key, scale, speedX, speedY){
  Phaser.Sprite.prototype.reset.call(this, x, y, health);
  
  this.loadTexture(key);
  this.scale.setTo(scale);
  this.body.velocity.x = speedX;
  this.body.velocity.y = speedY;
  
  this.enemyTimer.resume();
  
};

Flyer.Enemy.prototype.scheduleShooting = function() {
  this.shoot();
  
  this.enemyTimer.add(Phaser.Timer.SECOND, this.scheduleShooting, this);
};

Flyer.Enemy.prototype.shoot = function() {
  var bullet = this.enemyBullets.getFirstExists(false);
  
  if(!bullet){
    bullet = new Flyer.EnemyBullet(this.game, this.x, this.bottom);
    this.enemyBullets.add(bullet);
  }
  else{
    bullet.reset(this.x, this.y);
  }
  
  bullet.body.velocity.y = 350;
}
























