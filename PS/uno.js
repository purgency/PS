/*
* "Four in a row" chat plugin for Pokemon Showdown
* By syLph, based on hangman by bumbadadabum and Zarel
*/

'use strict';

const permission = 'announce';

class Uno extends Rooms.RoomGame {
	constructor(room, numberusers, user1, user2, user3, user4, user5, user6) {
		super(room);

		if (room.gameNumber) {
			room.gameNumber++;
		} else {
			room.gameNumber = 1;
		}

		this.gameid = 'uno';
		this.title = 'Uno';

		this.playernum = numberusers;
		
		var deck = ["blue1", "blue2", "blue3", "blue4", "blue5", "blue6", "blue7", "blue8", "blue9", "blue2x", "blueInvert", "blueSkip", 
		             "red1", "red2", "red3", "red4", "red5", "red6", "red7", "red8", "red9", "red2x", "redInvert", "redSkip",
		             "yellow1", "yellow2", "yellow3", "yellow4", "yellow5", "yellow6", "yellow7", "yellow8", "yellow9", "yellow2x", "yellowInvert", "yellowSkip",
		             "green1", "green2", "green3", "green4", "green5", "green6", "green7", "green8", "green9", "green2x", "greenInvert", "greenSkip",
		             "wish", "wish", "wish", "wish", "wish4x", "wish4x", "wish4x", "wish4x",];
		this.deck = shuffle(deck);
		this.players = [numberusers];
		this.counter = 0;
		for(var i = 0; i < numberusers; i++)
		{
			this.players[i] = [deck[0+counter], deck[1+counter], deck[2+counter], deck[3+counter], deck[4+counter], deck[5+counter], deck[6+counter]];
			this.counter += 7;
		}
		this.player = user1;
		this.winner = 0;
	}

	function shuffle(array) {
		  var m = array.length, t, i;

		  // While there remain elements to shuffle…
		  while (m) {

		    // Pick a remaining element…
		    i = Math.floor(Math.random() * m--);

		    // And swap it with the current element.
		    t = array[m];
		    array[m] = array[i];
		    array[i] = t;
		  }

		  return array;
		}
	
	play(card, user) {
		
	}

	generateWindow() {
		return "";
	}

	display(user, broadcast) {
		if (broadcast) {
			this.room.add('|uhtml|uno' + this.room.gameNumber + '|' + this.generateWindow());
		} else {
			user.sendTo(this.room, '|uhtml|uno' + this.room.gameNumber + '|' + this.generateWindow());
		}
	}
	
	display2(user, broadcast) {
		if (broadcast) {
			this.room.add('|uhtmlchange|uno' + this.room.gameNumber + '|' + this.generateWindow());
		} else {
			user.sendTo(this.room, '|uhtmlchange|uno' + this.room.gameNumber + '|' + this.generateWindow());
		}
	}

	end() {
		this.room.add('|uhtmlchange|uno' + this.room.gameNumber + '|<div class="infobox">(The game of Uno was ended.)</div>');
		this.room.add("The game of Uno was ended.");
		delete this.room.game;
	}

	finish() {
		delete this.room.game;
	}
}

exports.commands = {
	uno: {
		create: 'new',
		new: function (target, room, user) {
			let params = target.split(',');
			let user1 = params[0];
			//let user2,3,4...else
			if (!this.can(permission, null, room)) return false;
			if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");
			if (room.game) return this.errorReply("There is already a game in progress in this room.");

			room.game = new Uno(room, this.targetUserOrSelf(user1, true), this.targetUserOrSelf(user2, true));
			room.game.display(user, true);
			this.add("Player 1: " + user1 + " - Player 2: " + user2);

			return this.privateModCommand("(A game of Uno was started by " + user1.name + ".)");
		},
		createhelp: ["/uno create [user1], [user2] - Makes a new hangman game. Requires: % @ # & ~"],

		play: function (target, room, user) {
			if (!room.game || room.game.gameid !== 'uno') return this.errorReply("There is no game of uno running in this room.");
			if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");

			var result = room.game.play(target - 1, user);
			if(result == 2){
				room.game.display2(user, true);
			}
			else if(result == 1)
			{
				room.game.display(user, true);
				this.add("wooh, we have a winner ._.");
				room.game.finish();
			}
			else if(result == 0)
			{
				this.sendReply("either it's not your turn or the entered move is invalid");
			}
		},
		playhelp: ["/uno play [column] - Playes move into specified column. Column 1 at far left"],

		stop: 'end',
		end: function (target, room, user) {
			if (!this.can(permission, null, room)) return false;
			if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");
			if (!room.game || room.game.gameid !== 'uno') return this.errorReply("There is no game of uno running in this room.");

			room.game.end();
			return this.privateModCommand("(The game of Four in a row was ended by " + user.name + ".)");
		},
		endhelp: ["/uno end - Ends the game of Four in a row. Requires: % @ # & ~"],

		display: function (target, room, user) {
			if (!room.game || room.game.title !== 'Uno') return this.errorReply("There is no game of Four in a row running in this room.");
			if (!this.canBroadcast()) return;
			room.update();

			room.game.display(user, this.broadcasting);
		},

		'': function (target, room, user) {
			return this.parse('/help uno');
		}
	},

	unohelp: ["/uno allows users to play the popular game uno in PS rooms.",
				"Accepts the following commands:",
				"/uno create [user1], [user2] - Makes a new game. Requires: % @ # & ~",
				"/uno play [column] - Playes a move for the column specified. Column 1 is the one to the far left. shortcut: /fplay [column]",
				"/uno display - Displays the game.",
				"/uno end - Ends the game of hangman before the man is hanged or word is guessed. Requires: % @ # & ~"],

	uplay: function (target, room, user) {
		if (!room.game || room.game.gameid !== 'uno') return this.errorReply("There is no game of uno running in this room.");
		if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");

		var result = room.game.play(target - 1, user);
		if(result == 2){
			room.game.display2(user, true);
		}
		else if(result == 1)
		{
			room.game.display(user, true);
			this.add("wooh, we have a winner ._.");
			room.game.finish();
		}
		else if(result == 0)
		{
			this.sendReply("either it's not your turn or the entered move is invalid");
		}
	},
	playhelp: ["/uplay - Shortcut for /uno play.", "/uno play [column] - Playes into the column specified."]
};
