var game = new Phaser.Game(600,450, Phaser.AUTO, "");

var Menu = {
	preload:  function() {
		
		game.load.image("startBtn", "assets/start.png");
	
	},
	create: function() {
		
		game.stage.backgroundColor = "#ccffff";

		startButton = game.add.button(game.width/2, game.height/2, "startBtn",
			this.startGame, this);

		startButton.anchor.setTo(0.5);
	
	},
	startGame: function() {

		game.state.start("Game");

	}
};

var Game = {

	ground : null,

	player : null,

	obstacles : null, 

	time_until_spawn: null,

	last_spawn_time: null,

	cur_speed : 200,

	inc_speed : 0.05,

	preload : function() {
		
		game.load.image("ground","assets/ground.png");

		game.load.image("player","assets/player.png");

		game.load.image("obstacle","assets/obstacle.png");
	},

	create : function() {

		game.stage.backgroundColor = "#ffffff";

		game.physics.startSystem(Phaser.Physics.ARCADE);

		this.ground = game.add.sprite(0, game.world.height - 100, "ground");
		game.physics.arcade.enable(this.ground);
		this.ground.body.immovable = true;

		this.player = game.add.sprite(100, game.world.height -150, "player");
		game.physics.arcade.enable(this.player);
		this.player.body.gravity.y = 1000;

		this.obstacle = game.add.group();

		this.obstacle.enableBody = true;

		spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		spaceKey.onDown.add(this.jump, this);

		this.time_until_spawn = Math.random() * 1000 + 1000;
		this.last_spawn_time = game.time.time;
	},

	update: function() {

		game.physics.arcade.collide(this.player, this.ground);

		game.physics.arcade.overlap(this.player, this.obstacle, this.endGame, null, this);

		var cur_time = game.time.time;

		if (cur_time - this.last_spawn_time > this.time_until_spawn) {

			this.time_until_spawn = Math.random() *1000 + (1000 - this.cur_speed);

			this.last_spawn_time = cur_time;

			this.spawnObstacle();

		}

		this.incSpeed();
	},

	jump: function() {
		
		if (this.player.body.touching.down) {
			
			this.player.body.velocity.y = -500;

		}
	
	},

	spawnObstacle: function() {

		var obstacle = this.obstacle.create(game.world.width, game.world.height -150,
			"obstacle");

		obstacle.body.velocity.x = -this.cur_speed;

		obstacle.checkWorldBounds = true;

		obstacle.outOfBoundsKill = true;

	},

	incSpeed: function() {

		if (this.cur_speed < 500) {

			this.cur_speed += this.inc_speed;

		};

	},

	endGame: function() {

		game.state.start("Menu");

	}

};

game.state.add("Menu", Menu);
game.state.add("Game", Game);
game.state.start("Menu");


