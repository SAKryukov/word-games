/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const game = namespaces.create({
	definitionSet: {
		emptyCell: String.fromCodePoint(0x2205),
		gameIO: {
			gameSignature: "Balda game",
			gameName: "Balda",
			gameSuffix: "balda",
			suggestedInitialFileName: "balda-game.balda",
		}, //gameIO
		welcome: "Welcome to Balda!",
		input: {
			wordLength: {
				minimum: 0,
				maximum: 6,
				default: 0,
				size: 4,
				indexFromValue: function (value) { return value - this.minimum; },
				valueFromIndex: function (index) { return this.minimum + index; },
			}, //wordLength
			messages: {
				promptEnterCharacter: "Enter a letter at the beginning or end of the word and press Enter",
				promptEnterCharacterFirst: "Enter a letter and press Enter",
				congratulations: (word, quotes) =>
					`Game over. The word ${quotes[0]}${word}${quotes[1]} is found in the dictionary.`,
				relativeScore: (characters, total) => `${characters} of ${total}`,
			}, //messages
		}, //input
	}, //definitionSet
}); //game.definitionSet
