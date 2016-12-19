/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const GameView = __webpack_require__(1);

	addEventListener('DOMContentLoaded', () => {
	  let canvas = document.getElementById('game-canvas');
	  let ctx = canvas.getContext('2d');

	  let newGameView = new GameView(ctx);
	  newGameView.start();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(2);

	function GameView(ctx) {
	  this.ctx = ctx;
	  this.game = new Game();
	}
	GameView.prototype.start = function() {
	  setInterval(() => {
	    this.game.moveObjects();
	    this.game.draw(this.ctx);
	  }, 20);
	};

	module.exports = GameView;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(3);
	const Asteroid = __webpack_require__(4);
	const Ship = __webpack_require__(6);

	function Game() {
	  this.addAsteroids();
	  this.ship = new Ship();
	}
	Game.DIM_X = 600;
	Game.DIM_Y = 600;
	Game.NUM_ASTEROIDS = 10;

	Game.prototype.allObjects = function() {
	  return [this.ship].concat(this.asteroids);
	};
	Game.prototype.addAsteroids = function() {
	  this.asteroids = [];
	  for (let i = 0; i < Game.NUM_ASTEROIDS; i++) {
	    this.asteroids.push(new Asteroid(
	      Util.randomPos(Game.DIM_X, Game.DIM_Y)
	    ));
	  }
	};
	Game.prototype.draw = function(ctx) {
	  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
	  this.allObjects().forEach(object => object.draw(ctx));
	};
	Game.prototype.moveObjects = function() {
	  this.allObjects().forEach(objects => objects.move());
	  this.checkCollisions();
	};

	Game.prototype.checkCollisions = function() {
	  let toBeDestroyed = [];
	  this.allObjects().forEach((object, i) => {
	    this.allObjects().forEach((object2, j) => {
	      if (i !== j)
	        object.isCollidedWith(object2);
	    });
	  });
	};

	module.exports = Game;


/***/ },
/* 3 */
/***/ function(module, exports) {

	const Util = window.Util = {
	  inherits (childClass, parentClass) {
	    function Surrogate() {}
	    Surrogate.prototype = parentClass.prototype;
	    childClass.prototype = new Surrogate();
	    childClass.constructor = childClass;
	  },

	  randomVec(length) {
	    const deg = 2 * Math.PI * Math.random();
	    return Util.scale([Math.sin(deg), Math.cos(deg)], length);
	  },

	  scale(vec, m) {
	    return [vec[0] * m, vec[1] * m];
	  },

	  randomPos(maxX, maxY) {
	    return [Math.random() * maxX, Math.random() * maxY];
	  },

	  dist(pos1, pos2) {
	    return Math.sqrt(
	      Math.pow(pos1[0] - pos2[0], 2) +
	      Math.pow(pos1[1] - pos2[1], 2)
	    );
	  }
	};

	module.exports = Util;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(3);
	const MovingObject = __webpack_require__(5);
	const Ship = __webpack_require__(6);

	function Asteroid(pos) {
	  MovingObject.call(this, {
	    pos: pos,
	    vel: Util.randomVec(2),
	    color: Asteroid.COLOR,
	    radius: Asteroid.RADIUS
	  });
	}

	Util.inherits(Asteroid, MovingObject);

	Asteroid.COLOR = "darksalmon";
	Asteroid.RADIUS = 20;

	Asteroid.prototype.isCollidedWith = function(otherObject) {
	  let dist = Util.dist(this.pos, otherObject.pos);
	  if (otherObject instanceof Ship
	      && dist < (this.radius + otherObject.radius))
	    otherObject.relocate();
	};

	module.exports = Asteroid;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(3);

	function MovingObject(opts = {}) {
	  this.pos = opts.pos;
	  this.vel = opts.vel;
	  this.radius = opts.radius;
	  this.color = opts.color;
	}
	MovingObject.prototype.draw = function(ctx) {
	  ctx.fillStyle = this.color;

	  ctx.beginPath();
	  ctx.arc(
	    this.pos[0],
	    this.pos[1],
	    this.radius,
	    0,
	    2 * Math.PI
	  );

	  ctx.fill();
	};
	MovingObject.prototype.move = function() {
	  if (this.pos[0] + this.vel[0] > 600)
	  this.pos[0] = 0;
	  else if (this.pos[0] + this.vel[0] < 0)
	  this.pos[0] = 600;
	  else
	  this.pos[0] += this.vel[0];

	  if (this.pos[1] + this.vel[1] > 600)
	    this.pos[1] = 0;
	  else if (this.pos[1] + this.vel[1] < 0)
	    this.pos[1] = 600;
	  else
	    this.pos[1] += this.vel[1];
	};
	MovingObject.prototype.isCollidedWith = function(otherObject) {};

	module.exports = MovingObject;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(3);
	const MovingObject = __webpack_require__(5);

	function Ship() {
	  MovingObject.call(this, {
	    pos: Util.randomPos(600, 600),
	    vel: [0, 0],
	    color: Ship.COLOR,
	    radius: Ship.RADIUS
	  });
	}
	Util.inherits(Ship, MovingObject);

	Ship.COLOR = "teal";
	Ship.RADIUS = 15;

	Ship.prototype.relocate = function() {
	  this.pos = Util.randomPos(600, 600);
	  this.vel = [0, 0];
	};

	module.exports = Ship;


/***/ }
/******/ ]);