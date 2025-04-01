/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const getGameDefinitionSet = () => {
	const gameDefinitionSet = {};

	gameDefinitionSet.emptyCell = String.fromCodePoint(0x2205);

    gameDefinitionSet.gameIO = {
        gameSignature: "Balda game",
        gameName: "Balda",
		gameSuffix: "balda",
        suggestedInitialFileName: "balda-game.balda",
    }; //gameDefinitionSet.gameIO

	gameDefinitionSet.welcome = "Welcome to Balda!";
	gameDefinitionSet.input = {};

	gameDefinitionSet.input.wordLength = {
		minimum: 0,
		maximum: 6,
		default: 0,
		size: 4,
		indexFromValue: function (value) { return value - this.minimum; },
		valueFromIndex: function (index) { return this.minimum + index; },
	}; //gameDefinitionSet.input.wordLength

	gameDefinitionSet.input.messages = {
		promptEnterTrialWord: "Enter a letter at the beginning or end of the word and press Enter",
		congratulations: (word, quotes) =>
			`Game over. The word ${quotes[0]}${word}${quotes[1]} is found in the dictionary.`,
	}; //gameDefinitionSet.input.messages

	Object.freeze(gameDefinitionSet);
	return gameDefinitionSet;
};
