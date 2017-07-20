"use strict";

var C = {
  background: {
    image: 'assets/background.png',
    scroll: 700,
    scale: 1
  },
  dodger: {
    image: 'assets/dodger.png',
    width: 64,
    height: 64,
    frames: 7,
    startx: 160,
    starty: 500,
    bounce: 0.3,
    drag: 3000,
    speed: 600
  },
  dodgeme: {
    image: 'assets/dodgeme.png',
    width: 64,
    height: 64,
    frames: 2,
    gravity: 5000, // set to 0 to just use velocity
    velocity: 1100 // ignored if gravity > 0
  }
};



class BootState {

  init() {
    console.log("Booting")

    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
  }

  create() {
    game.state.start('Preload')
  }

}

class PreloadState {

  create() {
    game.state.start('Start')
  }

}

class StartState {

  init() {
  }

  preload() {
    this.load.image('background',C.background.image);
    this.load.spritesheet('dodger',
      C.dodger.image,
      C.dodger.width,
      C.dodger.height,
      C.dodger.frames
    );
    this.load.spritesheet('dodgeme',
      C.dodgeme.image,
      C.dodgeme.width,
      C.dodgeme.height,
      C.dodgeme.frames
    );
  }

  create() {
    game.state.start('Play')
  }

}

class PlayState {

  create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // background
    this.background = this.add.tileSprite(0,0,320,568,'background');
    this.background.autoScroll(0,C.background.scroll);
    this.background.scale.set(C.background.scale);

    // dodger
    this.dodger = this.add.sprite(C.dodger.startx,C.dodger.starty,'dodger');
    //this.dodger.smoothed = false;
    //this.dodger.scale.set(1);
    this.dodger.anchor.set(0.5,0.5);
    this.dodger.animations.add('blink');
    this.dodger.animations.play('blink',C.dodger.frames,true);
    game.physics.arcade.enable(this.dodger);
    this.dodger.body.collideWorldBounds = true;
    this.dodger.body.bounce.setTo(C.dodger.bounce);
    this.dodger.body.drag.setTo(C.dodger.drag);


    this.dodgeme = this.add.sprite(160,-32,'dodgeme');

    this.dodgeme.anchor.set(0.5,0.5);
    this.dodgeme.animations.add('blink');
    this.dodgeme.animations.play('blink',C.dodgeme.frames,true);
    game.physics.arcade.enable(this.dodgeme);
    if (C.dodgeme.gravity > 0) {
      this.dodgeme.body.gravity.y = C.dodgeme.gravity;
    } else {
      this.dodgeme.body.velocity.y = C.dodgeme.velocity;
    }
    this.resetDodgeme();


    this.cursors = game.input.keyboard.createCursorKeys();
  }

  update() {
    if (this.cursors.left.isDown) {
      this.dodger.body.velocity.x = -C.dodger.speed;
    }
    if (this.cursors.right.isDown) {
      this.dodger.body.velocity.x = C.dodger.speed;
    }
    if (this.dodgeme.y >= 568) {
      this.resetDodgeme();
    }
    game.physics.arcade.collide(this.dodgeme,this.dodger,this.handleCollision);
  }

  resetDodgeme() {
      this.dodgeme.y = -32;
      if (C.dodgeme.gravity > 0) {
        this.dodgeme.body.velocity.y = 0;
      }
      this.dodgeme.x = game.rnd.integerInRange(0,320);
  }

  handleCollision() {
    game.state.start('End')
  }

}

class EndState {

  create() {
    game.state.start('Start')
  }

}

var game = new Phaser.Game(320,568);
game.state.add('Boot', BootState);
game.state.add('Preload', PreloadState);
game.state.add('Start', StartState);
game.state.add('Play', PlayState);
game.state.add('End', EndState);
game.state.start('Boot');
