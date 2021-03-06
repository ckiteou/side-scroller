'use strict';

describe('Renderer', function () {
  var moomin;
  var player;
  var score;
  var world;
  var soundEngine;

  beforeEach(function () {
    spyOn(document, 'getElementById').and.returnValue(canvas);
    player = new Player();
    score = new Score();
    world = Matter.Engine.create().world;
    soundEngine = new SoundEngine(player, score);
    moomin = new Renderer(player, world, soundEngine);
  });

  describe('#sounds', function () {
    it('plays the player sounds', function () {
      spyOn(soundEngine, 'runSounds');
      moomin.sounds();
      expect(soundEngine.runSounds).toHaveBeenCalled();
    })
  });

  describe('#playerMovement', function () {
    beforeEach(function () {
      spyOn(Matter.Body, 'setAngle');
      spyOn(player, 'jump');
      spyOn(player, 'moveLeft');
      spyOn(player, 'moveRight');
      moomin.playerMovement()
    });

    it('maintains the player body angle', function () {
      expect(Matter.Body.setAngle).toHaveBeenCalled();
    });

    it('checks if the player is jumping', function () {
      expect(player.jump).toHaveBeenCalled();
    });

    it('checks if the player is moving left', function () {
      expect(player.moveLeft).toHaveBeenCalled();
    });

    it('checks if the player is moving right', function () {
      expect(player.moveRight).toHaveBeenCalled();
    });
  });

  describe('#reverseVelocity', function () {
    beforeEach(function () {
      spyOn(player, 'getBodyObject').and.returnValue(playerBody);
      spyOn(Matter.Body, 'applyForce');
    });

    it('applies a force to the player', function () {
      moomin.reverseVelocity();
      expect(Matter.Body.applyForce).toHaveBeenCalled();
    });
  });

  describe('#checkBorder', function () {
    beforeEach(function () {
      spyOn(player, 'getBodyObject').and.returnValue(playerBody);
      spyOn(moomin, 'reverseVelocity');
    });

    it('applies a reverse force if the player tries to exit the world to the left', function () {
      playerBody.bounds.min.x = -1;
      moomin.checkBorder();
      expect(moomin.reverseVelocity).toHaveBeenCalled();
    });

    it('applies a reverse force if the player tries to exit the world to the right', function () {
      playerBody.bounds.max.x = worldOptions.viewWidth + 1;
      moomin.checkBorder();
      expect(moomin.reverseVelocity).toHaveBeenCalled();
    });

    it('otherwise does nothing', function () {
      playerBody.bounds.min.x = 10;
      playerBody.bounds.max.x = 10;
      moomin.checkBorder();
      expect(moomin.reverseVelocity).not.toHaveBeenCalled();
    });
  });

  describe('#scroll', function () {
    beforeEach(function () {
      spyOn(player, 'getBodyObject').and.returnValue(playerBody);
    });

    it('moves the view rightwards if the player moves to the right half of the screen', function () {
      playerBody.position.x = (worldOptions.viewWidth * 0.5) + 1;
      var priorRightEdge = moomin.viewport.rightEdge;
      moomin.scroll();
      expect(moomin.viewport.rightEdge).toBeGreaterThan(priorRightEdge);
    });

    it('otherwise leaves the view in position', function () {
      playerBody.position.x = (worldOptions.viewWidth * 0.5) - 1;
      var priorRightEdge = moomin.viewport.rightEdge;
      moomin.scroll();
      expect(moomin.viewport.rightEdge).toEqual(priorRightEdge);
    });
  });

  describe('#scoreText', function () {
    it('returns the current score as a string', function () {
      expect(moomin.scoreText()).toEqual("Score: 0");
    });
  });

  describe('#showDestructionPercentage', function () {
    it('returns the destruction percentage', function () {
      moomin.receiveDestructionPercentage("50%");
      expect(moomin.showDestructionPercentage()).toEqual("50%");
    });
  });

  describe('#receiveDestructionPercentage', function () {
    it('sets a destruction percentage amount', function () {
      moomin.receiveDestructionPercentage("50%");
      expect(moomin.destructionPercentage).toEqual("50%");
    });
  });

  describe('#receiveScore', function () {
    it('sets the score to be the received number', function () {
      moomin.receiveScore(1);
      expect(moomin.scoreText()).toEqual("Score: 1");
    });
  });

  describe('#gameLoop', function () {
    beforeEach(function () {
      spyOn(moomin, 'playerMovement');
      spyOn(moomin, 'checkBorder');
      spyOn(moomin, 'sounds');
      spyOn(moomin, 'scroll');
      spyOn(moomin, 'drawPlayer');
      spyOn(player, 'spriteUpdate');
      moomin.gameLoop()
    });

    it('calls the playerMovement function', function () {
      expect(moomin.playerMovement).toHaveBeenCalled();
    });

    it('calls the checkBorder function', function () {
      expect(moomin.checkBorder).toHaveBeenCalled();
    });

    it('calls the sounds function', function () {
      expect(moomin.sounds).toHaveBeenCalled();
    });

    it('calls the scroll function', function () {
      expect(moomin.scroll).toHaveBeenCalled();
    });
  });

  describe('#spriteLoop', function () {
    it('loops the player sprite', function () {
      spyOn(player, 'spriteUpdate');
      moomin.spriteLoop();
      expect(player.spriteUpdate).toHaveBeenCalled();
    });
  });

  describe('#updateScreen', function () {
    beforeEach(function () {
      spyOn(context, 'beginPath');
      spyOn(context, 'clearRect');
      spyOn(context, 'translate');
      spyOn(context, 'setTransform');
      spyOn(context, 'fillText');
      spyOn(context, 'drawImage');
      spyOn(moomin, 'drawPlayer');
      spyOn(moomin, 'drawObjects')
      spyOn(moomin, 'scoreText');
      spyOn(moomin, 'endGameScreen');
      spyOn(window, 'requestAnimationFrame');
      spyOn(Player.prototype, 'livesText');
      moomin.updateScreen();
    });

    it('clears the view', function () {
      expect(context.clearRect).toHaveBeenCalled();
    });

    it('translates the view', function () {
      expect(context.translate).toHaveBeenCalled();
    });

    it('draws the background', function () {
      expect(context.drawImage).toHaveBeenCalled();
    });

    it('draws the player', function () {
      expect(moomin.drawPlayer).toHaveBeenCalled();
    });

    it('draws the player name and score', function () {
      expect(context.fillText.calls.count()).toEqual(2);
      expect(moomin.scoreText).toHaveBeenCalled();
    });

    it('transforms the view', function () {
      expect(context.setTransform).toHaveBeenCalled();
    });

    it('calls requestAnimationFrame with itself as a callback', function () {
      moomin.updateScreen();
      spyOn(moomin, 'updateScreen');
      window.requestAnimationFrame.calls.allArgs()[0][0]();
      expect(moomin.updateScreen).toHaveBeenCalled();
    });

    it('calls endGameScreen instead if the game is over', function () {
      spyOn(gameController, 'isGameOver').and.returnValue(true);
      moomin.updateScreen();
      expect(moomin.endGameScreen).toHaveBeenCalled();
    });
  });

  describe('#endGameScreen', function () {
    it('calls fillText to display text on the canvas', function () {
      spyOn(context, 'fillText');
      moomin.endGameScreen();
      expect(context.fillText).toHaveBeenCalled();
    });

    it('shows the final score, including the bonus', function () {
      spyOn(moomin, 'scoreText');
      moomin.endGameScreen();
      expect(moomin.scoreText).toHaveBeenCalled();
    });

    it('shows the destruction percentage', function () {
      spyOn(moomin, 'showDestructionPercentage');
      moomin.endGameScreen();
      expect(moomin.showDestructionPercentage).toHaveBeenCalled();
    });
  });

  describe('#drawPlayer', function() {
    beforeEach(function() {
      spyOn(context, 'drawImage')
      spyOn(player, 'spriteImage');
      spyOn(player, 'spriteFrameIndexes').and.returnValue([[],[]]);
      spyOn(player, 'spriteDirection').and.returnValue(1);
      spyOn(player, 'spriteCurrentFrame');
      spyOn(player, 'spriteWidth');
      spyOn(player, 'spriteHeight');
      spyOn(player, 'getBodyObject').and.returnValue(playerBody);
      moomin.drawPlayer()
    });

    it('calls drawImage on this.ctx', function() {
      expect(context.drawImage).toHaveBeenCalled()
    });

    it('calls spriteImage on this.player', function() {
      expect(player.spriteImage).toHaveBeenCalled()
    });

    it('calls spriteFrameIndexes on this.player', function() {
      expect(player.spriteFrameIndexes).toHaveBeenCalled()
    });

    it('calls spriteDirection on this.player', function() {
      expect(player.spriteDirection).toHaveBeenCalled()
    });

    it('calls spriteCurrentFrame on this.player', function() {
      expect(player.spriteCurrentFrame).toHaveBeenCalled()
    });

    it('calls spriteWidth on this.player', function() {
      expect(player.spriteWidth).toHaveBeenCalled()
    });

    it('calls spriteHeight on this.player', function() {
      expect(player.spriteHeight).toHaveBeenCalled()
    });

    it('calls getBodyObject on this.player', function() {
      expect(player.getBodyObject).toHaveBeenCalled()
    });

  });

  describe('#drawObjects', function () {
    beforeEach(function() {
      spyOn(moomin, 'drawObjectSprite');
      spyOn(context, 'drawImage')
    });

    it('calls drawImage for object when instructed', function () {
      world.bodies[0] = {label: "object", position: {x:0, y:0}, angle: 1, render: {sprite: {xOffset: 1, yOffset: 1, xScale: 1, yScale: 1}}};
      moomin.drawObjects();
      expect(moomin.drawObjectSprite).toHaveBeenCalled();
    });

    it('calls drawImage for platform when instructed', function () {
      world.bodies[0] = {label: "platform", position: {x:0, y:0}, render: {sprite: {xOffset: 1, yOffset: 1, xScale: 1, yScale: 1}}};
      moomin.drawObjects();
      expect(context.drawImage).toHaveBeenCalled();
    });

    it('calls drawImage for end-platform when instructed', function () {
      world.bodies[0] = {label: "endGamePlatform", position: {x:0, y:0}, render: {sprite: {xOffset: 1, yOffset: 1, xScale: 1, yScale: 1}}};
      moomin.drawObjects();
      expect(context.drawImage).toHaveBeenCalled();
    });

    it('calls drawImage for floor when instructed', function () {
      world.bodies[0] = {label: "floor", position: {x:0, y:0}, angle: 1, render: {sprite: {xOffset: 1, yOffset: 1, xScale: 1, yScale: 1}}};
      moomin.drawObjects();
      expect(moomin.drawObjectSprite).toHaveBeenCalled();
    });

    it('calls drawImage for cactus when instructed', function () {
      world.bodies[0] = {label: "cactus", position: {x:0, y:0}, angle: 1, render: {sprite: {xOffset: 1, yOffset: 1, xScale: 1, yScale: 1}}};
      moomin.drawObjects();
      expect(moomin.drawObjectSprite).toHaveBeenCalled();
    });

    it('doesnt call drawImage for other labels', function () {
      world.bodies[0] = {label: "whatever_bro", position: {x:0, y:0}, render: {sprite: {xOffset: 1, yOffset: 1, xScale: 1, yScale: 1}}};
      moomin.drawObjects();
      expect(context.drawImage).not.toHaveBeenCalled();
    });
  });

  describe('#drawObjectSprite', function () {
    beforeEach(function() {
      spyOn(context, 'drawImage');
      spyOn(context, 'rotate');
      spyOn(context, 'translate')
    });

    it('draws the object sprite when called', function () {
      world.bodies[0] = {label: "cactus", position: {x:0, y:0}, angle: 1, render: {sprite: {xOffset: 1, yOffset: 1, xScale: 1, yScale: 1}}};
      var body = world.bodies[0];
      moomin.drawObjectSprite(body, "texture");
      expect(context.rotate).toHaveBeenCalled();
      expect(context.translate).toHaveBeenCalled();
      expect(context.drawImage).toHaveBeenCalled();
    });
  })
});
