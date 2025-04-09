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
			gameSignature: "Bulls and cows game",
			gameName: "Bulls and cows",
			gameSuffix: "cattle",
			suggestedInitialFileName: "saved-bulls-and-cows-game.cattle",
			// Its length should be no less than gameDefinitionSet.input.wordLength.maximum:
			obfuscationSeed: [42344, 3216, 4327, 32, 49, 31232, 43432, 202, 132, 32314],
			delimiter: "-",
			empty: "",
		}, //gameIO
		revealSecretWordPopup: {
			buttonText: "Close",
			textAlign: "center",
		}, //revealSecretWordPopup
		input: {
			wordLength: {
				minimum: 2,
				maximum: 9,
				default: 6,
				size: 4,
				indexFromValue: function (value) { return value - this.minimum; },
				valueFromIndex: function (index) { return this.minimum + index; },
			}, //input.wordLength
			messages: {
				promptEnterTrialWordInitial: "Enter the characters. In two last cells, you will see the sum of <i>bulls+cows</i>, and the number of <i>bulls</i>.",
				promptEnterTrialWord: "Enter the trial word",
				notFilledRow: "Fill in <b><i>all</i></b> the cells in the last row and press Enter",
				badWord: (guessWord, quotes) =>
					`The word ${quotes[0]}${guessWord}${quotes[1]} is not in dictionary`,
				congratulations: "Congratulations!",
			}, //input.messages
		}, //input
		images: {
			total: "🏡",
			bull: "🐮",
		}, //images
		empty: "",
		sample: "TRY",
}, //definitionSet
}); //game.definitionSet
