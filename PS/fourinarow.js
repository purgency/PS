/*
* "Four in a row" chat plugin for Pokemon Showdown
* By syLph, based on hangman by bumbadadabum and Zarel
*/

'use strict';

const permission = 'announce';

class Fourinarow extends Rooms.RoomGame {
	constructor(room, user1, user2) {
		super(room);

		if (room.gameNumber) {
			room.gameNumber++;
		} else {
			room.gameNumber = 1;
		}

		this.gameid = 'fourinarow';
		this.title = 'Fourinarow';

		this.board = [
		              [0,0,0,0,0,0,0],
		              [0,0,0,0,0,0,0],
		              [0,0,0,0,0,0,0],
		              [0,0,0,0,0,0,0],
		              [0,0,0,0,0,0,0],
		              [0,0,0,0,0,0,0],
		              ];
		this.player1 = user1;
		this.player2 = user2;
		this.player = user1;
		this.winner = 0;
	}

	play(column, user) {
		if(user != this.player)
		{
			return 0;
		}
		else
		{
			if(this.winner === 0)
			{
			let symbol = 0;	
			user == this.player1? symbol = 1 : symbol = 2;
			let played = false;
			
			for(var i=0;i<6;i++)
				{
					if(this.board[i][column] == 0 && played == false)
						{
						this.board[i][column] = symbol;
						played = true;
						}
				}
			for(var i=0;i<6;i++) // checkwinhorizontal -
			{
				for(var k=0;k<4;k++)
					{
						if(this.board[i][k] != 0 && this.board[i][k] == this.board[i][k+1] && this.board[i][k] == this.board[i][k+2] && this.board[i][k] == this.board[i][k+3])
							{
								this.player == this.player1 ? this.winner = 1 : this.winner = 2;
							}
					}
			}

			for(var i=0;i<3;i++) //checkwinvertical |
			{
				for(var k=0;k<7;k++)
					{
						if(this.board[i][k] != 0 && this.board[i][k] == this.board[i+1][k] && this.board[i][k] == this.board[i+2][k] && this.board[i][k] == this.board[i+3][k])
							{
								this.player == this.player1 ? this.winner = 1 : this.winner = 2;
							}
					}
			}
			
			for(var i=5;i>2;i--)  //checkwindiagonalTLBR \
			{
				for(var k=0;k<4;k++)
					{
						if(this.board[i][k] != 0 && this.board[i][k] == this.board[i-1][k+1] && this.board[i][k] == this.board[i-2][k+2] && this.board[i][k] == this.board[i-3][k+3])
						{
							this.player == this.player1 ? this.winner = 1 : this.winner = 2;
						}
					}
			}

			for(var i=0;i<3;i++) //checkwindiagonalBLTR /
			{
				for(var k=0;k<4;k++)
					{
						if(this.board[i][k] != 0 && this.board[i][k] == this.board[i+1][k+1] && this.board[i][k] == this.board[i+2][k+2] && this.board[i][k] == this.board[i+3][k+3])
						{
							this.player == this.player1 ? this.winner = 1 : this.winner = 2;
						}
					}
			}
			}
			
			this.player == this.player1 ? this.player = this.player2 : this.player = this.player1;
			if (this.winner !== 0) {
				return 1;
			}
			return 2;
		}
	}

	generateWindow() {
		return "&#124;" + this.board[5][0] + "&#124;" + this.board[5][1] + "&#124;" + this.board[5][2] + "&#124;" + this.board[5][3] + "&#124;" + this.board[5][4] + "&#124;" + this.board[5][5] + "&#124;" + this.board[5][6] + "&#124;" + "<br>" +
				"&#124;" + this.board[4][0] + "&#124;" + this.board[4][1] + "&#124;" + this.board[4][2] + "&#124;" + this.board[4][3] + "&#124;" + this.board[4][4] + "&#124;" + this.board[4][5] + "&#124;" + this.board[4][6] + "&#124;" + "<br>" +
				"&#124;" + this.board[3][0] + "&#124;" + this.board[3][1] + "&#124;" + this.board[3][2] + "&#124;" + this.board[3][3] + "&#124;" + this.board[3][4] + "&#124;" + this.board[3][5] + "&#124;" + this.board[3][6] + "&#124;" + "<br>" +
				"&#124;" + this.board[2][0] + "&#124;" + this.board[2][1] + "&#124;" + this.board[2][2] + "&#124;" + this.board[2][3] + "&#124;" + this.board[2][4] + "&#124;" + this.board[2][5] + "&#124;" + this.board[2][6] + "&#124;" + "<br>" +
				"&#124;" + this.board[1][0] + "&#124;" + this.board[1][1] + "&#124;" + this.board[1][2] + "&#124;" + this.board[1][3] + "&#124;" + this.board[1][4] + "&#124;" + this.board[1][5] + "&#124;" + this.board[1][6] + "&#124;" + "<br>" +
				"&#124;" + this.board[0][0] + "&#124;" + this.board[0][1] + "&#124;" + this.board[0][2] + "&#124;" + this.board[0][3] + "&#124;" + this.board[0][4] + "&#124;" + this.board[0][5] + "&#124;" + this.board[0][6] + "&#124;";
	}

	display(user, broadcast) {
		if (broadcast) {
			this.room.add('|uhtml|fourinarow' + this.room.gameNumber + '|' + this.generateWindow());
		} else {
			user.sendTo(this.room, '|uhtml|fourinarow' + this.room.gameNumber + '|' + this.generateWindow());
		}
	}
	
	display2(user, broadcast) {
		if (broadcast) {
			this.room.add('|uhtmlchange|fourinarow' + this.room.gameNumber + '|' + this.generateWindow());
		} else {
			user.sendTo(this.room, '|uhtmlchange|fourinarow' + this.room.gameNumber + '|' + this.generateWindow());
		}
	}

	end() {
		this.room.add('|uhtmlchange|fourinarow' + this.room.gameNumber + '|<div class="infobox">(The game of fourinarow was ended.)</div>');
		this.room.add("The game of fourinarow was ended.");
		delete this.room.game;
	}

	finish() {
		delete this.room.game;
	}
}

exports.commands = {
	fourinarow: {
		create: 'new',
		new: function (target, room, user) {
			let params = target.split(',');
			let user1 = params[0];
			let user2 = params.slice(1).join(',').trim();
			if(user1 == "" || user2 == "" || user1 == user2)
			{
				this.sendReply("unvalid users");
			}
			else
			{
				if (!this.can(permission, null, room)) return false;
				if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");
				if (room.game) return this.errorReply("There is already a game in progress in this room.");
	
				room.game = new Fourinarow(room, this.targetUserOrSelf(user1, true), this.targetUserOrSelf(user2, true));
				room.game.display(user, true);
				this.add("Player 1: " + user1 + " - Player 2: " + user2);
	
				return this.privateModCommand("(A game of Fourinarow was started by " + user1.name + ".)");
			}
		},
		createhelp: ["/fourinarow create [user1], [user2] - Makes a new hangman game. Requires: % @ # & ~"],

		play: function (target, room, user) {
			if (!room.game || room.game.gameid !== 'fourinarow') return this.errorReply("There is no game of fourinarow running in this room.");
			if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");

			var result = room.game.play(target, user);
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
				this.sendReply("it's not your turn");
			}
		},
		playhelp: ["/fourinarow play [column] - Playes move into specified column. Column 0 at far left"],

		stop: 'end',
		end: function (target, room, user) {
			if (!this.can(permission, null, room)) return false;
			if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");
			if (!room.game || room.game.gameid !== 'fourinarow') return this.errorReply("There is no game of fourinarow running in this room.");

			room.game.end();
			return this.privateModCommand("(The game of Four in a row was ended by " + user.name + ".)");
		},
		endhelp: ["/fourinarow end - Ends the game of Four in a row. Requires: % @ # & ~"],

		display: function (target, room, user) {
			if (!room.game || room.game.title !== 'Fourinarow') return this.errorReply("There is no game of Four in a row running in this room.");
			if (!this.canBroadcast()) return;
			room.update();

			room.game.display(user, this.broadcasting);
		},

		'': function (target, room, user) {
			return this.parse('/help fourinarow');
		}
	},

	fourinarowhelp: ["/fourinarow allows users to play the popular game fourinarow in PS rooms.",
				"Accepts the following commands:",
				"/fourinarow create [user1], [user2] - Makes a new game. Requires: % @ # & ~",
				"/fourinarow play [column] - Playes a move for the column specified. Column 0 is the one to the far left. shortcut: /fplay [column]",
				"/fourinarow display - Displays the game.",
				"/fourinarow end - Ends the game of hangman before the man is hanged or word is guessed. Requires: % @ # & ~"],

	fplay: function (target, room, user) {
		if (!room.game || room.game.gameid !== 'fourinarow') return this.errorReply("There is no game of fourinarow running in this room.");
		if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");

		var result = room.game.play(target, user);
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
			this.sendReply("it's not your turn");
		}
	},
	playhelp: ["/fplay - Shortcut for /fourinarow play.", "/fourinarow play [column] - Playes into the column specified."]
};
