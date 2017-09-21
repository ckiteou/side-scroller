var KEY_W = 87;
var KEY_A = 65;
var KEY_S = 83;
var KEY_D = 68;
var keys = [];
var playerName;
var gameController;
var opening;

(function(exports) {
  'use strict';

  var domInterface = {
    eventListeners: function () {
      document.body.addEventListener('keyup', function(e) {
        keys[e.keyCode] = false;
      });
      document.body.addEventListener('keydown', function(e) {
        keys[e.keyCode] = true;
      });
      var reset = document.getElementById('reset_game');
      reset.addEventListener('click', function(e) {
        domInterface.hideResetButton();
        domInterface.showForm();
        domInterface.resetGame();
      });
      domInterface.collectNameAndStart();
    },

    gameOpening: function() {
      opening = new OpeningScreen();
      opening.draw();
    },

    collectNameAndStart: function() {
      document
        .getElementById("player_name_form")
        .addEventListener("submit", function(submitEvent) {
          submitEvent.preventDefault();
          domInterface.getInput();
          domInterface.resetForm();
          domInterface.hideForm();
          domInterface.gameStart();
        });
    },

    gameStart: function() {
      gameController = new GameController();
      gameController.ready();
      gameController.render();
    },

    getInput: function () {
      playerName = document.forms[0].player_name.value;
    },

    resetForm: function () {
      document
        .getElementById("player_name_form")
        .reset();
    },

    hideForm: function () {
      document
        .getElementById("player_name_form")
        .style = "display:none;";
    },

    showForm: function () {
      document
        .getElementById("player_name_form")
        .style = "display: initial;";
    },

    showResetButton: function () {
      document
        .getElementById("reset_game")
        .style = "display: initial;";
    },

    hideResetButton: function () {
      document
        .getElementById("reset_game")
        .style = "display: none;";
    },

    resetGame: function () {
      keys = [];
      gameController.endGame();
      domInterface.gameOpening();
    }
  };

  exports.domInterface = domInterface;
}(this));
