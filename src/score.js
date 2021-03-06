'use strict';

function Score() {
  this.points = 0;
  this.END_BONUS = 50;
}

Score.prototype.showPoints = function () {
  return this.points;
};

Score.prototype.increase = function (points) {
  this.points = points;
};

Score.prototype.endBonus = function (ratio) {
  this.destructionRatio = ratio;
  this.points += Math.floor(this.END_BONUS*ratio);
};

Score.prototype.calculateDestructionPercentage = function () {
  return Math.floor(this.destructionRatio * 100) + "%";
};
