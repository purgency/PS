/*
* "Uno" chat plugin for Pokemon Showdown
* By syLph, based on hangman by bumbadadabum and Zarel
*/

'use strict';

const permission = 'announce';


class Uno extends Rooms.RoomGame {
	constructor(room, name) {
		super(room);

		if (room.gameNumber) {
			room.gameNumber++;
		} else {
			room.gameNumber = 1;
		}
		this.gameid = 'uno';
		this.title = 'Uno';
		
		this.signed = new Array();
		this.started = false;
		this.cpunames = ["wishXippo#theylikeitrough", "kinnikumanVSippo#returnmywaifu", "Dynamite sexy", "Jack", "BlizzardHailStormOfDoom69", "CharizardBlastaMaster", "TfishClanx3Hermine<3", "chickenlord123"];
		this.cpus = new Array();
		
		this.room.add("A game of Uno was created by " + name);
		this.room.addRaw('<button type="button" value="/uno join" name="send">' + "Join" + '</button>' + '<button type="button" value="/uno leave" name="send">' + "Leave" + '</button>' + '<button type="button" value="/uno addcpu" name="send">' + "Add cpu" + '</button>' + '<button type="button" value="/uno removecpu" name="send">' + "Remove cpu" + '</button>' + '<button type="button" value="/uno start" name="send">' + "Start" + '</button>');
		
	}
	
	addcpu(room){
		if(this.cpunames.length > 0){
			this.cpus.push(shufflecards(this.cpunames).pop());
			this.room.add(this.cpus[this.cpus.length -1] + " entered the Uno signups");
		}
	}
	
	removecpu(room){
		if(this.cpus.length > 0){
			this.cpunames.push(shufflecards(this.cpus).pop());
			this.room.add(this.cpunames[this.cpunames.length -1] + " left the Uno signups");
		}
	}
	
	join(room, name) {
		var bool = true;
		this.signed.forEach(function(entry) {
			if(entry === name) {
				bool = false;
			}
		});
		if (bool){
			this.signed.push(name);
			this.room.add(name + " entered the Uno signups");
		}
	}
	
	leave(room, name) {
		var bool = false;
		this.signed.forEach(function(entry) {
			if(entry === name) {
				bool = true;
			}
		});
		if (bool){
			this.signed.pop(name);
			this.room.add(name + " left the Uno signups");
		}
	}
		
	start(room, numberusers, users, user) {
		this.started = true;
		this.allids = shufflecards(users);
		this.playernum = numberusers;
		this.cpumove = false;
		
		this.allplayers = new Array(numberusers);
		for(var i = 0 ; i < numberusers ; i++){
			var boola = true;
			for(var j = 0 ; j < this.cpus.length ; j++){
				if(this.allids[i] === this.cpus[j]) boola = false;
			}
			if(boola) {
				this.allplayers[i] = this.allids[i].name;
			} else {
				this.allplayers[i] = this.allids[i];
			}
		}
		
		for(var i = 0 ; i < this.playernum ; i++){
			var boolb = true;
			for(var j = 0 ; j < this.cpus.length ; j++){
				if(this.allids[i] === this.cpus[j]) boolb = false;
			}
			if(boolb) this.allids[i].sendTo(room, user.name + " started the game");
		}
		
		
		
		this.allplayersdecksizes = new Array(numberusers);
		for (var i = 0 ; i < numberusers ; i++) {
			this.allplayersdecksizes[i] = 7;
		}
		
		this.deck = ["blue.0", "blue.1", "blue.2", "blue.3", "blue.4", "blue.5", "blue.6", "blue.7", "blue.8", "blue.9", "blue.2x", "blue.Invert", "blue.skip", 
		             "red.0", "red.1", "red.2", "red.3", "red.4", "red.5", "red.6", "red.7", "red.8", "red.9", "red.2x", "red.Invert", "red.skip",
		             "yellow.0", "yellow.1", "yellow.2", "yellow.3", "yellow.4", "yellow.5", "yellow.6", "yellow.7", "yellow.8", "yellow.9", "yellow.2x", "yellow.Invert", "yellow.skip",
		             "green.0", "green.1", "green.2", "green.3", "green.4", "green.5", "green.6", "green.7", "green.8", "green.9", "green.2x", "green.Invert", "green.skip",
		             "wish.", "wish.", "wish.", "wish.", "wish.4x", "wish.4x", "wish.4x", "wish.4x",
		             "blue.1", "blue.2", "blue.3", "blue.4", "blue.5", "blue.6", "blue.7", "blue.8", "blue.9", "blue.2x", "blue.Invert", "blue.skip", 
		             "red.1", "red.2", "red.3", "red.4", "red.5", "red.6", "red.7", "red.8", "red.9", "red.2x", "red.Invert", "red.skip",
		             "yellow.1", "yellow.2", "yellow.3", "yellow.4", "yellow.5", "yellow.6", "yellow.7", "yellow.8", "yellow.9", "yellow.2x", "yellow.Invert", "yellow.skip",
		             "green.1", "green.2", "green.3", "green.4", "green.5", "green.6", "green.7", "green.8", "green.9", "green.2x", "green.Invert", "green.skip",];
		this.deck = shufflecards(this.deck);
		this.playersdeck = new Array(numberusers);
		for(var i = 0; i < numberusers; i++)
		{
			this.playersdeck[i] = [this.deck.shift(), this.deck.shift(), this.deck.shift(), this.deck.shift(), this.deck.shift(), this.deck.shift(), this.deck.shift()];
		}
		while(this.deck[0].split('.')[0] === "wish" || this.deck[0].split('.')[1] === "2x" || this.deck[0].split('.')[1] === "4x") {
			this.deck = shufflecards(this.deck);
		}
		this.currentcard = this.deck.shift();
		this.playeronmovenumber = 0;
		this.player = this.allplayers[0];
		this.wishforcolor = false;
		this.drawcards = 0;
		this.invert = (this.currentcard.split('.')[1] === "invert" ?  false : true);
		this.skip = (this.currentcard.split('.')[1] === "skip" ?  true : false);
		this.checkrun = false;
		var bool = checknextplayer(this, 0, 0);
		while(!bool){
			if (this.invert){
				this.playeronmovenumber = mod(this.playeronmovenumber + 1, this.playernum);
			}
			else {
				this.playeronmovenumber = mod(this.playeronmovenumber - 1, this.playernum);
			}
			this.player = this.allplayers[this.playeronmovenumber];
			
			
			
			bool = checknextplayer(this, this.playeronmovenumber);
		}
		var comp = false
		for(var j = 0 ; j < this.cpus.length ; j++){
			if(this.player === this.cpus[j]) comp = true;
		}
		this.cpumove = comp;
		if (comp) {
			var card = checknextplayer(this, this.playeronmovenumber);
			this.room.game.play(card, this.player, "doesntmatter")
		}
	}
	
	choosecolor(color, user){
		if((color === "blue" || color === "yellow" || color === "red" || color === "green") && this.wishforcolor && (this.invert ? this.allplayers[mod(this.playeronmovenumber - 1, this.playernum)] : this.allplayers[mod(this.playeronmovenumber + 1, this.playernum)])){
			this.currentcard = color + ".any";
			this.wishforcolor = false;
			
			for(var i = 0 ; i < this.playernum ; i++){
				var boolean = true;
				for(var j = 0 ; j < this.cpus.length ; j++){
					if(this.allids[i] === this.cpus[j]) boolean = false;
				}
				if(boolean) this.allids[i].sendTo(this.room, this.allplayers[this.playeronmovenumber] + " wished for a " + color + " card");
			}
			
			var bool = false
			while(!bool){
				if (this.invert){
					this.playeronmovenumber = mod(this.playeronmovenumber + 1, this.playernum);
				}
				else {
					this.playeronmovenumber = mod(this.playeronmovenumber - 1, this.playernum);
				}
				this.player = this.allplayers[this.playeronmovenumber];
				
				bool = checknextplayer(this, this.playeronmovenumber);
			}
			var comp = false
			for(var j = 0 ; j < this.cpus.length ; j++){
				if(this.player === this.cpus[j]) comp = true;
			}
			this.cpumove = comp;
			if (comp) {
				var card = checknextplayer(this, this.playeronmovenumber);
				this.room.game.play(card, this.player, "doesntmatter")
			}
			return true;
		} else {
			var booleanb = true;
			for(var j = 0 ; j < this.cpus.length ; j++){
				if(this.allids[this.playeronmovenumber] === this.cpus[j]) booleanb = false;
			}
			if(booleanb) user.sendTo(this.room, "nah ._.");
			return false;
		}
	}
	
	showcards(id){
		for(var i = 0 ; i < this.playernum ; i++){
			if(this.allids[i] === id) id.sendTo(this.room, yourcardsare(this, i));
		}
	}

	play(card, user, id) {
		if (this.cpumove || this.checkrun || (!this.wishforcolor && user === this.player && cardinhand(card, this.playersdeck[this.playeronmovenumber]))){
			let attributes = card.split('.');
			let attributescurrent = this.currentcard.split('.');
			if (this.drawcards > 0 && (attributes[1] === "2x" || attributes[1] === "4x") || (!(this.drawcards > 0 && !(attributes[1] === "2x" || attributes[1] === "4x")) && !(this.skip === true && attributescurrent[1] === "skip" && !(attributes[1] === "skip"))  && (attributes[0] === attributescurrent[0] || attributes[0] === "wish" || attributes[1] === attributescurrent[1]))){
				if(!this.checkrun) {
					if (attributes[1] === "2x"){
						this.drawcards += 2;
					}
					else if(attributes[1] === "Invert"){
						this.invert = !this.invert;
					}
					else if(attributes[1] === "skip"){
						this.skip = true
					}
					else if(attributes[1] === "4x"){
						this.drawcards += 4;
					}
					if (attributes[0] === "wish"){
						this.wishforcolor = true;
					}
					var index = this.playersdeck[this.playeronmovenumber].indexOf(card);
					this.playersdeck[this.playeronmovenumber].splice(index, 1);
					this.allplayersdecksizes[this.playeronmovenumber] -= 1;
					if(this.allplayersdecksizes[this.playeronmovenumber] === 0) {
						this.room.addRaw('<div class="broadcast-blue"><strong>' + "Congrats " + user + " you have won" + '</strong></div>');
						this.room.game.end();
						return "finish";
					} else {
						this.deck.push(this.currentcard);
						this.currentcard = card;
						
						for(var i = 0 ; i < this.playernum ; i++){
							var boolean = true;
							for(var j = 0 ; j < this.cpus.length ; j++){
								if(this.allids[i] === this.cpus[j]) boolean = false;
							}
							if(boolean) this.allids[i].sendTo(this.room, user + " played " + card);
						}
						
						if(this.wishforcolor) {
							for(var i = 0 ; i < this.playernum ; i++){
								var boolb = true;
								for(var j = 0 ; j < this.cpus.length ; j++){
									if(this.allids[i] === this.cpus[j]) boolb = false;
								}
								if(boolb) this.allids[i].sendTo(this.allplayers[this.playeronmovenumber] + " please choose the next color.");
							}
							if(!this.cpumove){
								createcolorbuttons(this, this.playeronmovenumber);
							} else {
								this.room.game.choosecolor(shufflecards(["red", "green", "yellow", "blue"])[0], "wayne");
							}
						} else {
							var bool = false
							while(!bool){
								if (this.invert){
									this.playeronmovenumber = mod(this.playeronmovenumber + 1, this.playernum);
								}
								else {
									this.playeronmovenumber = mod(this.playeronmovenumber - 1, this.playernum);
								}
								this.player = this.allplayers[this.playeronmovenumber];
								
								bool = checknextplayer(this, this.playeronmovenumber);
							}
							var comp = false
							for(var j = 0 ; j < this.cpus.length ; j++){
								if(this.player === this.cpus[j]) comp = true;
							}
							this.cpumove = comp;
							if (comp) {
								var card = checknextplayer(this, this.playeronmovenumber);
								this.room.game.play(card, this.player, "doesntmatter")
							}
						}
					}
				}
				else {
					return true;
				}
			}
			else {
				if(!this.checkrun){
					var booleanz = true;
					for(var j = 0 ; j < this.cpus.length ; j++){
						if(this.allids[this.playeronmovenumber] === this.cpus[j]) booleanz = false;
					}
					if(booleanz) id.sendTo(this.room, "you can't play this card ._.");
					return "nah";
				}
				return false;
			}
		}
		else {
			id.sendTo(this.room, "Nah ._.");
			return "nah";
		}
	}

	generateWindow(i) {
		return "The current card is: " + this.currentcard + (this.drawcards > 0 ? " | drawcards is active" : "") + "<br>" +
		getdecksizes(this) + "<br>" +
		this.allplayers[this.playeronmovenumber] + " please choose your card";
	}
	
	display(user, broadcast) {
		if(!this.wishforcolor){
			if (broadcast) {
				for(var i = 0 ; i < this.playernum ; i++){
					var booleanz = true;
					for(var j = 0 ; j < this.cpus.length ; j++){
						if(this.allids[i] === this.cpus[j]) booleanz = false;
					}
					if(booleanz) this.allids[i].sendTo(this.room, '|uhtml|uno' + this.room.gameNumber + '|' + this.generateWindow(i));
					if(booleanz && i !== this.playeronmovenumber) this.allids[i].sendTo(this.room, yourcardsare(this, i));
				}
			} else {
				id.sendTo(this.room, '|uhtml|uno' + this.room.gameNumber + '|' + this.generateWindow());
			}
			createbuttons(this, this.playeronmovenumber);
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
		
		create: function (target, room, user){

			if (!this.can(permission, null, room)) return false;
			if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");
			if (room.game) return this.errorReply("There is already a game in progress in this room.");
			
			room.game = new Uno(room, user.name);
		},
		createhelp: ["/uno create - Makes a new Uno game. Requires: % @ # & ~"],

		join: function (target, room, user){
			if (!room.game || room.game.gameid !== 'uno') return this.errorReply("There is no game of Uno running in this room.");
			if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");
			if(!room.game.started){
				
				room.game.join(room, user.name);
			} else {
				return this.errorReply("The game is already in progress");
			}
		},
		
		leave: function (target, room, user){
			if (!room.game || room.game.gameid !== 'uno') return this.errorReply("There is no game of Uno running in this room.");
			if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");
			if(!room.game.started){
				
				room.game.leave(room, user.name);
			} else {
				return this.errorReply("The game is already in progress");
			}	
		},
		
		start: function (target, room, user) {
			if (!room.game || room.game.gameid !== 'uno') return this.errorReply("There is no game of Uno running in this room.");
			if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");
			if(!room.game.started){
				let params = room.game.signed.concat(room.game.cpus);
				let playernum = params.length;
				if(playernum > 1){
					let users = new Array();
					for(var i = 0 ; i < playernum ; i++){
						var booleany = true;
						for(var j = 0 ; j < room.game.cpus.length ; j++){
							if(params[i] === room.game.cpus[j]) booleany = false;
						}
						if(booleany){
							users[i] = this.targetUserOrSelf(params[i], true);
						} else {
							users[i] = params[i];
						}
						if(typeof(users[i]) == "undefined") return this.errorReply("Invalid user");
					}
		
					room.game.start(room, playernum, users, user);
					if(typeof(room.game) != "undefined") room.game.display(user, true);
				} else {
					return this.errorReply("not enough players");
				}
			} else {
				return this.errorReply("The game is already in progress");
			}		
		},

		play: function (target, room, user) {
			if (!room.game || room.game.gameid !== 'uno') return this.errorReply("There is no game of Uno running in this room.");
			if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");

			var x = room.game.play(target, user.name, user);
			if(typeof(room.game) != "undefined") room.game.display(user, true);
		},
		playhelp: ["/uno play [card] - Plays card"],
		
		cards: function (target, room, user){
			if (!room.game || room.game.gameid !== 'uno') return this.errorReply("There is no game of Uno running in this room.");
			if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");

			room.game.showcards(user);
		},
		cardshelp: ["/uno cards - displays your cards"],
		
		color: function (target, room, user) {
			if (!room.game || room.game.gameid !== 'uno') return this.errorReply("There is no game of Uno running in this room.");
			if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");

			var valid = room.game.choosecolor(target, user);
			if(valid) room.game.display(user, true);
		},
		colorhelp: ["/uno color [color] - Chooses color"],
		
		addcpu: function (target, room, user) {
			if (!room.game || room.game.gameid !== 'uno') return this.errorReply("There is no game of Uno running in this room.");
			if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");
			if(!room.game.started){
				
				room.game.addcpu(room);
			} else {
				return this.errorReply("The game is already in progress");
			}
		},
		addcpuhelp: ["/uno addcpu - Adds a computer player"],
		
		removecpu: function (target, room, user) {
			if (!room.game || room.game.gameid !== 'uno') return this.errorReply("There is no game of Uno running in this room.");
			if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");
			if(!room.game.started){
				
				room.game.removecpu(room);
			} else {
				return this.errorReply("The game is already in progress");
			}
		},
		addcpuhelp: ["/uno addcpu - Adds a computer player"],

		stop: 'end',
		end: function (target, room, user) {
			if (!this.can(permission, null, room)) return false;
			if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");
			if (!room.game || room.game.gameid !== 'uno') return this.errorReply("There is no game of uno running in this room.");

			room.game.end();
			return this.privateModCommand("(The game of Uno was ended by " + user.name + ".)");
		},
		endhelp: ["/uno end - Ends the game of Four in a row. Requires: % @ # & ~"],

		display: function (target, room, user) {
			if (!room.game || room.game.title !== 'Uno') return this.errorReply("There is no game of Uno running in this room.");
			if (!this.canBroadcast()) return;
			room.update();

			if(typeof(room.game) != "undefined") room.game.display(user, this.broadcasting);
		},

		'': function (target, room, user) {
			return this.parse('/help uno');
		}
	},

	unohelp: ["/uno allows users to play the popular game uno in PS rooms.",
				"Accepts the following commands:",
				"/uno create [user1],[user2],... - Makes a new game. Requires: % @ # & ~",
				"/uno play [card] - Plays specified card. shortcut: /uplay [card]",
				"/uno color [color] - Chooses a color after a wish card is played. shortcut: /ucolor [color]",
				"/uno display - Displays the game.",
				"/uno cards - Displays your cards.",
				"/uno end - Ends the game of uno. Requires: % @ # & ~"],
				
	ucolor: function (target, room, user){
		if (!room.game || room.game.gameid !== 'uno') return this.errorReply("There is no game of Uno running in this room.");
		if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");

		var valid = room.game.choosecolor(target, user);
		if(typeof(room.game) != "undefined") room.game.display(user, true);
	},
	colorhelp: ["/uno color [color] - Chooses color"],

	uplay: function (target, room, user) {
		if (!room.game || room.game.gameid !== 'uno') return this.errorReply("There is no game of Uno running in this room.");
		if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");

		var x = room.game.play(target, user.name, user);
		if(typeof(room.game) != "undefined") room.game.display(user, true);
	},
	playhelp: ["/uplay - Shortcut for /uno play.", "/uno play [card] - Plays specified card."]
};

function shufflecards(array) {
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

function yourcardsare(uno, i) {
	var string = "Your cards are";
	uno.playersdeck[i].forEach(function(entry) {
		string += " " + entry;
	});
	return string;
}

function cardinhand(card, hand) {
	var bool = false;
	hand.forEach(function(entry) {
		if(card === entry) {
			bool = true;
		}
	});
	return bool;
}

function checknextplayer(uno, c) {
	uno.checkrun = true;
	var bool = false;
	var card = "";
	
	if(uno.drawcards > 0) {
		uno.playersdeck[c].forEach(function(entry) {
			let attributes = entry.split('.');
			if(attributes[1] === "2x" || attributes[1] === "4x") {
				bool = true;
				if(uno.cpumove && bool) card = entry;
			}
		});
		if(!bool){
			for(var i = 0 ; i < uno.playernum ; i++){
				var booleano = true;
				for(var j = 0 ; j < uno.cpus.length ; j++){
					if(uno.allids[i] === uno.cpus[j]) booleano = false;
				}
				if(booleano) uno.allids[i].sendTo(uno.room, uno.allplayers[c] + " had to draw " + uno.drawcards + " cards!");
			}
			while(uno.drawcards !== 0){
				uno.playersdeck[c].push(uno.deck.shift());
				uno.drawcards--;
				uno.allplayersdecksizes[c] += 1;
			}
		}
	}
	else if(uno.skip){
		uno.playersdeck[c].forEach(function(entry) {
			let attributes = entry.split('.');
			if(attributes[1] === "skip") {
				bool = true;
				if(uno.cpumove && bool) card = entry;
			}
		});
		if(!bool) { 
			uno.skip = false;
			for(var i = 0 ; i < uno.playernum ; i++){
				var booleanie = true;
				for(var j = 0 ; j < uno.cpus.length ; j++){
					if(uno.allids[i] === uno.cpus[j]) booleanie = false;
				}
				if(booleanie) uno.allids[i].sendTo(uno.room, uno.allplayers[c] + " was skipped");
			}
		}
	}
	else {
		uno.playersdeck[c].forEach(function(entry) {
			if(!bool) {
				bool = uno.play(entry, uno.player);
				card = entry;
			}
		});
		if(!bool){
			for(var i = 0 ; i < uno.playernum ; i++){
				var boolean = true;
				for(var j = 0 ; j < uno.cpus.length ; j++){
					if(uno.allids[i] === uno.cpus[j]) boolean = false;
				}
				if(boolean) uno.allids[i].sendTo(uno.room, uno.allplayers[c] + " had to draw a card!");
			}
			uno.playersdeck[c].push(uno.deck.shift());
			uno.allplayersdecksizes[c] += 1;
		}
	}
	
	uno.checkrun = false;
	if (bool && uno.cpumove) return card;
	return bool;
}

function mod(n, m) {
    return ((n % m) + m) % m;
}

function getdecksizes(uno){
	var string = "";
	for(var i = 0 ; i < uno.playernum ; i++){
		string = string + (uno.allplayers[i] + " has " + uno.allplayersdecksizes[i] + " cards. ");
	}
	return string;
}

function createbuttons(uno, i){
	var string = "";
	var x = uno.allplayersdecksizes[i];
	for(var k = 0; k < x ; k++){
	    if(uno.playersdeck[i][k] === "blue.0"){
			string = string + '<button type="button" value="/uplay blue.0" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "blue.1"){
			string = string + '<button type="button" value="/uplay blue.1" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "blue.2"){
			string = string + '<button type="button" value="/uplay blue.2" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "blue.3"){
			string = string + '<button type="button" value="/uplay blue.3" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "blue.4"){
			string = string + '<button type="button" value="/uplay blue.4" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "blue.5"){
			string = string + '<button type="button" value="/uplay blue.5" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "blue.6"){
			string = string + '<button type="button" value="/uplay blue.6" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "blue.7"){
			string = string + '<button type="button" value="/uplay blue.7" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "blue.8"){
			string = string + '<button type="button" value="/uplay blue.8" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "blue.9"){
			string = string + '<button type="button" value="/uplay blue.9" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "blue.skip"){
			string = string + '<button type="button" value="/uplay blue.skip" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "blue.Invert"){
			string = string + '<button type="button" value="/uplay blue.Invert" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "blue.2x"){
			string = string + '<button type="button" value="/uplay blue.2x" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "red.0"){
			string = string + '<button type="button" value="/uplay red.0" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "red.1"){
			string = string + '<button type="button" value="/uplay red.1" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "red.2"){
			string = string + '<button type="button" value="/uplay red.2" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "red.3"){
			string = string + '<button type="button" value="/uplay red.3" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "red.4"){
			string = string + '<button type="button" value="/uplay red.4" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "red.5"){
			string = string + '<button type="button" value="/uplay red.5" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "red.6"){
			string = string + '<button type="button" value="/uplay red.6" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "red.7"){
			string = string + '<button type="button" value="/uplay red.7" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "red.8"){
			string = string + '<button type="button" value="/uplay red.8" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "red.9"){
			string = string + '<button type="button" value="/uplay red.9" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "red.skip"){
			string = string + '<button type="button" value="/uplay red.skip" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "red.Invert"){
			string = string + '<button type="button" value="/uplay red.Invert" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "red.2x"){
			string = string + '<button type="button" value="/uplay red.2x" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "green.0"){
			string = string + '<button type="button" value="/uplay green.0" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "green.1"){
			string = string + '<button type="button" value="/uplay green.1" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "green.2"){
			string = string + '<button type="button" value="/uplay green.2" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "green.3"){
			string = string + '<button type="button" value="/uplay green.3" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "green.4"){
			string = string + '<button type="button" value="/uplay green.4" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "green.5"){
			string = string + '<button type="button" value="/uplay green.5" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "green.6"){
			string = string + '<button type="button" value="/uplay green.6" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "green.7"){
			string = string + '<button type="button" value="/uplay green.7" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "green.8"){
			string = string + '<button type="button" value="/uplay green.8" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "green.9"){
			string = string + '<button type="button" value="/uplay green.9" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "green.skip"){
			string = string + '<button type="button" value="/uplay green.skip" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "green.Invert"){
			string = string + '<button type="button" value="/uplay green.Invert" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "green.2x"){
			string = string + '<button type="button" value="/uplay green.2x" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "yellow.0"){
			string = string + '<button type="button" value="/uplay yellow.0" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "yellow.1"){
			string = string + '<button type="button" value="/uplay yellow.1" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "yellow.2"){
			string = string + '<button type="button" value="/uplay yellow.2" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "yellow.3"){
			string = string + '<button type="button" value="/uplay yellow.3" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "yellow.4"){
			string = string + '<button type="button" value="/uplay yellow.4" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "yellow.5"){
			string = string + '<button type="button" value="/uplay yellow.5" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "yellow.6"){
			string = string + '<button type="button" value="/uplay yellow.6" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "yellow.7"){
			string = string + '<button type="button" value="/uplay yellow.7" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "yellow.8"){
			string = string + '<button type="button" value="/uplay yellow.8" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "yellow.9"){
			string = string + '<button type="button" value="/uplay yellow.9" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "yellow.skip"){
			string = string + '<button type="button" value="/uplay yellow.skip" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "yellow.Invert"){
			string = string + '<button type="button" value="/uplay yellow.Invert" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "yellow.2x"){
			string = string + '<button type="button" value="/uplay yellow.2x" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "wish."){
			string = string + '<button type="button" value="/uplay wish." name="send">' + uno.playersdeck[i][k] + '</button>';
		}
		else if(uno.playersdeck[i][k] === "wish.4x"){
			string = string + '<button type="button" value="/uplay wish.4x" name="send">' + uno.playersdeck[i][k] + '</button>';
		}
	}
	var boolean = true;
	for(var j = 0 ; j < uno.cpus.length ; j++){
		if(uno.allids[i] === uno.cpus[j]) boolean = false;
	}
	if(boolean) uno.allids[i].sendTo(uno.room,'|raw|' + string);
}

function move(uno, i, k){
	uno.room.game.play(uno.playersdeck[i][k], uno.allplayers[i], uno.allids[i]);
}

function createcolorbuttons(uno, i){
	var string = "";
	string = string + '<button type="button" value="/ucolor red" name="send">' + "red" + '</button>';
	string = string + '<button type="button" value="/ucolor blue" name="send">' + "blue" + '</button>';
	string = string + '<button type="button" value="/ucolor green" name="send">' + "green" + '</button>';
	string = string + '<button type="button" value="/ucolor yellow" name="send">' + "yellow" + '</button>';
	var boolean = true;
	for(var j = 0 ; j < uno.cpus.length ; j++){
		if(uno.allids[i] === uno.cpus[j]) boolean = false;
	}
	if(boolean) uno.allids[i].sendTo(uno.room,'|raw|' + string);
}