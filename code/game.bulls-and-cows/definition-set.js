/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const getGameDefinitionSet = () => {
	const gameDefinitionSet = {};

	gameDefinitionSet.input = {};

	gameDefinitionSet.input.wordLength = {
		minimum: 2,
		maximum: 9,
		default: 6,
		size: 4,
		indexFromValue: function (value) { return value - this.minimum; },
		valueFromIndex: function (index) { return this.minimum + index; },
	}; //gameDefinitionSet.input.wordLength

	gameDefinitionSet.input.messages = {
		promptEnterTrialWordInitial: "Enter the characters. In two last cells, you will see the sum of <i>bulls+cows</i>, and the number of <i>bulls</i>.",
		promptEnterTrialWord: "Enter the trial word",
		notFilledRow: "Fill in <b><i>all</i></b> the cells in the last row and press Enter",
		badWord: (guessWord, quotes) =>
			`The word ${quotes[0]}${guessWord}${quotes[1]} is not in dictionary`,
		congratulations: "Congratulations!",
	}; //gameDefinitionSet.input.messages

	gameDefinitionSet.images = {
		total: "🏡",
		bull: "🐮",
	};

	gameDefinitionSet.empty = "";
	gameDefinitionSet.sample = "TRY";

	return gameDefinitionSet;
};
