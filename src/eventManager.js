'use strict';

function EventManager(engine) {
  this.engine = engine;
}

EventManager.prototype.playerCollisionEvent = function (event, object, action) {
  var manager = this;
  event.pairs.forEach(function (pair) {
    if (manager.isBodyPlayer(pair.bodyA)) {
        object[action]();
    } else if (manager.isBodyPlayer(pair.bodyB)) {
        object[action]();
    }
  });
};

EventManager.prototype.playerCollision = function (object, eventName, action) {
  var manager = this;
  Matter.Events.on(this.engine, eventName, function(event) {
    manager.playerCollisionEvent(event, object, action);
 });
};

EventManager.prototype.pairBodyLabels = function (pair) {
  return [pair.bodyA.label, pair.bodyB.label].sort().join();
};

EventManager.prototype.validCollisionPairs = function (pair) {
  return this.pairBodyLabels(pair) === 'floor,object' || this.pairBodyLabels(pair) === 'cactus,player';
};

EventManager.prototype.isBodyPlayer = function (body) {
  return body.label === 'playerSensor';
};

EventManager.prototype.collisionStarts = function (object, callback) {
  var manager = this;
  Matter.Events.on(this.engine, 'collisionStart', function(event) {
    manager[callback](event, object);
  });
};

EventManager.prototype.objectCollisionEvent = function (event, worldBuilder) {
  var manager = this;
  event.pairs.forEach(function (pair) {
    if (manager.validCollisionPairs(pair)) {
      if (pair.bodyA.label === 'object' || pair.bodyA.label === 'cactus') {
        worldBuilder.objectCollided(pair.bodyA);
      } else {
        worldBuilder.objectCollided(pair.bodyB);
      }
    }
  });
};

EventManager.prototype.lifeAndDeathCollisionEvent = function (event, controller) {
  var manager = this;
  event.pairs.forEach(function (pair) {
    if(manager.isBodyPlayer(pair.bodyA))
      if (pair.bodyB.label === 'endGamePlatform') {
        controller.endGame();
      } else if (pair.bodyB.label === 'floor') {
        controller.playerLosesLifeOnFloor();
      }
  });
};
