/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

if (!String.prototype.format) {
	Object.defineProperty(String.prototype, "format", {
		enumerable: false, configurable: false, writable: false,
  		value: function() {
			var args = arguments;
			return this.replace(/{(\d+)}/g, function(match, number) { 
				return args[number] != undefined ? args[number] : match;
			}) //replace
		}
	});
} //if !String.prototype.format

const constants = { left:37, right:39, escape: 27, enter: 13, blankSpace: "", nonBreakingSpace:"&nbsp;", objectType: typeof({})};

const dictionaryUtility = {

	shuffleWord: (word, firstTime) => {
		if (firstTime)
			return word;
		var array = word.split("");
		var length = array.length;
		for (var index = length - 1; index > 0; --index) {
			var random = Math.floor(Math.random() * (index + 1));
			var tmp = array[index];
			array[index] = array[random];
			array[random] = tmp;
		} //loop
		return array.join("");
	}, //shuffleWord

	removeCharacters: (word, character) => {
		var split = word.split(character);
		var result = "";
		for (var index = 0; index<split.length; ++index) {
			if (split[index] != character)
			result += split[index];
		} //loop
		return {result: result, count: split.length - 1};    
	},

	isSubset: (trialWord, setWord) => {
		for (let char of trialWord)
			if (setWord.indexOf(char) < 0)
				return false;
			else
			    setWord = setWord.replace(char, "");
		return true;
	},

}; //dictionaryUtility