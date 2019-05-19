var Flyer = Flyer || {};

Flyer.GameState = {
  
  init: function(currentLevel) {
    //console.log(this == Flyer.GameState);
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.cursors = this.game.input.keyboard.createCursorKeys();
    
    this.numLevels = 3;
    this.currentLevel = currentLevel ? currentLevel : 1;
  },
  
  preload: function() {
    
    this.load.image('alien1', 'assets/images/alien1.png');
    this.load.image('alien2', 'assets/images/alien2.png');
    this.load.image('alien3', 'assets/images/alien3.png');
    this.load.image('alien4', 'assets/images/alien4.png');
    this.load.image('alien5', 'assets/images/enemy.png');
    this.load.image('enemyParticle', 'assets/images/enemyParticle.png');
    this.load.image('enemyBullet', 'assets/images/fire.png');
    this.load.image('playerBullet', 'assets/images/yellowlaser.png');
    this.load.image('player', 'assets/images/purpleship.png');
    this.load.image('background', 'assets/images/spacefield.jpeg');
    
    this.load.text('level1', 'assets/data/level1.json');
    this.load.text('level2', 'assets/data/level2.json');
    this.load.text('level3', 'assets/data/level3.json');
    
  },
  
  create: function() {
    
    this.background = this.add.tileSprite(0, 0, this.game.width, this.game.height - 40, 'background');
    this.background.autoScroll(0, 250);
    
    this.levelText = this.game.add.text(40, this.game.world.height - 20, 'LEVEL: ' + this.currentLevel, {font: "bold 16px Arial", fill: "white"});
    this.levelText.anchor.setTo(0.5);
    
    this.scoreString = 'SCORE: ';
    this.scoreText = this.game.add.text(this.game.world.width - 45, this.game.world.height - 20, this.scoreString + score, {font: "bold 16px Arial", fill: "white"});
    this.scoreText.anchor.setTo(0.5);

    this.livesString = 'LIVES: '
    this.livesText = this.game.add.text(this.game.world.centerX, this.game.world.height - 20, this.livesString, {font: "bold 16px Arial", fill: "white"});
    this.livesText.anchor.setTo(0.5);
    
    this.player = this.add.sprite(this.game.world.centerX, this.game.height - 75, 'player');
    this.player.anchor.setTo(0.5);
    this.game.physics.arcade.enable(this.player);
    this.player.body.collideWorldBounds = true;
    
    this.initLives();
    
    this.initPlayerBullets();
    
    this.shootingTimer = this.game.time.events.loop(Phaser.Timer.SECOND/5, this.firePlayerBullet, this);
    
    this.initEnemies();
    
    this.loadLevel();
    
  },
  
  update: function(){
    
    
    this.player.body.velocity.x = 0
    this.player.body.velocity.y = 0
    
    this.game.physics.arcade.overlap(this.playerBullets, this.enemies, this.damageEnemy, null, this);
    
    this.game.physics.arcade.overlap(this.enemyBullets, this.player, this.killPlayer, null, this);
    
    this.game.physics.arcade.overlap(this.enemies, this.player, this.killPlayer, null, this);
        
    if(this.cursors.left.isDown){
      this.player.body.velocity.x = -300;
    }
    if(this.cursors.right.isDown){
      this.player.body.velocity.x = 300;
    }
    if(this.cursors.up.isDown){
      this.player.body.velocity.y = -300;
    }
    if(this.cursors.down.isDown){
      this.player.body.velocity.y = 300;
    }
    if(this.player.y === this.game.world.height - 200){
      this.player.y += 5;
    }
    if(this.player.y === this.game.world.height - 60){
      this.player.y -= 5;
    }

  },
  
  initPlayerBullets: function() {
    this.playerBullets = this.add.group();
    this.playerBullets.enableBody = true;
    
  },
  
  initLives: function () {
    this.lives = this.game.add.group();
    
    for(var i = 0; i < 3; i++){
      this.ship = this.lives.create(this.game.world.centerX+(i * 20) + 50, this.game.world.height - 25, 'player');
      this.ship.anchor.setTo(0.5);
      this.ship.scale.setTo(0.45);
      
    }
  },
  
  initEnemies: function() {
    
    this.enemies = this.game.add.group();
    this.enemies.enableBody = true;
    
    this.enemyBullets = this.add.group();
    this.enemyBullets.enableBody = true;
      
  },
  
  firePlayerBullet: function() {
    
    var bullet = this.playerBullets.getFirstExists(false);
    
    if(!bullet){
      bullet = new Flyer.PlayerBullet(this.game, this.player.x, this.player.top);
      this.playerBullets.add(bullet);
    }
    else {
      bullet.reset(this.player.x, this.player.top);
    }
    bullet.body.velocity.y = -500;
    
  },
  
  damageEnemy: function(bullet, enemy) {
    
    score++;
    this.scoreText.text = this.scoreString + score;
    enemy.damage(1);
    bullet.kill();
    
  },
  
  killPlayer: function(player, bullet){
    bullet.kill();
    
    this.live = this.lives.getFirstAlive();
    
    if(this.live){
      this.live.kill();
    }
    
    if(this.lives.countLiving() < 1){
      this.player.kill();
      score = 0;
      this.state.start('GameState');
    }
    
  },
  
  createEnemy: function(x, y, health, key, scale, speedX, speedY) {
    
    var enemy = this.enemies.getFirstExists(false);
    
    if(!enemy){
      enemy = new Flyer.Enemy(this.game, x, y, key, health, this.enemyBullets);
      this.enemies.add(enemy);
    }
    
    enemy.reset(x, y, health, key, scale, speedX, speedY);
  },
  
  loadLevel: function(){
    
    this.currentEnemyIndex = 0;
    
    
    this.levelData = JSON.parse(this.game.cache.getText('level' + this.currentLevel));
    
    
    this.endOfLevelTimer = this.game.time.events.add(this.levelData.duration * 1000, function(){
      
      if(this.currentLevel < this.numLevels){
        this.currentLevel++;
      }
      else{
        this.currentLevel = 1;
      }
      
      this.game.state.start('GameState', true, false, this.currentLevel);
      
    }, this);
    

    this.scheduleNextEnemy();
    
  },

  scheduleNextEnemy: function() {
    var nextEnemy = this.levelData.enemies[this.currentEnemyIndex];
  
    if(nextEnemy){
      var nextTime = 1000 * (nextEnemy.time - (this.currentEnemyIndex == 0 ? 0 : this.levelData.enemies[this.currentEnemyIndex-1].time));
    
      this.nextEnemyTimer = this.game.time.events.add(nextTime, function(){
        this.createEnemy(nextEnemy.x * this.game.world.width, -100, nextEnemy.health, nextEnemy.key, nextEnemy.scale, nextEnemy.speedX, nextEnemy.speedY);
      
        this.currentEnemyIndex++;
        this.scheduleNextEnemy();
      }, this);
    
    
    }
  },
};
