/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const getGameAlgorithm = languageSelector => {
    const gameAlgorithm = {};

	const binarySearch = (sortedCollection, word) => {
		let left = 0;
		let right = sortedCollection.length - 1;
		while (left <= right) {
			let middle = Math.floor((left + right) / 2);
			if (sortedCollection[middle] < word)
				left = middle + 1;
			else if (sortedCollection[middle] > word)
				right = middle - 1;
			else
				return middle;
		} //loop
		return;
	}; //binarySearch

    gameAlgorithm.isInDictionary = word =>
        binarySearch(languageSelector.currentLanguage.alphabetical, word.toLowerCase()) != null;

    gameAlgorithm.pickRandomWord = length => {
        const generateIt = () => {
            const indexArray = languageSelector.currentLanguage.indexedByLength[length];
            if (!indexArray) return null;
            const indexLength = indexArray.length;
            if (indexLength < 1) return null;
            const randomIndex = Math.floor(Math.random() * indexLength);
            const index = indexArray[randomIndex];
            return languageSelector.currentLanguage.alphabetical[index];    
        }; // generateIt
        const badLetterFound = (word, letters) => {
            for (let index = 0; index < letters.length; ++index)
                if (word.indexOf(letters[index]) < 0) return false;
            return true;
        }; //badLetterFound
        const goodWord = word => {
            if (!word) return false;
            if (!languageSelector.acceptBlankspaceCharactersValue &&
                word.indexOf(languageSelector.currentLanguage.characterRepertoire.blankSpace) >= 0)
                    return false;
            if (!languageSelector.acceptPunctuationCharactersValue &&
                badLetterFound(word, languageSelector.currentLanguage.characterRepertoire.punctuation))
                    return false;
            return true;
        }; //goodWord
        let word = null;
        while (true) {
            word = generateIt();
            if (goodWord(word))
                return word;
        } //loop
    }; //gameAlgorythm.pickRandomWord

    gameAlgorithm.evaluateBullsAndCowsSolution = (secretWord, guessWord) => {
        let bulls = 0;
        guessWord = guessWord.toLowerCase();
        for (let index = 0; index < secretWord.length; ++index)
            if (secretWord[index] == guessWord[index])
                ++bulls;
        if (bulls == guessWord.length)
            return { total: bulls, bulls: bulls };
        let total = 0;
        let shadowGuessWord = guessWord;
        for (let index = 0; index <guessWord.length; ++index) {
            const letter = guessWord[index];
            if (shadowGuessWord.indexOf(letter) < 0) continue;
            if (secretWord.indexOf(letter) >= 0) {
                ++total;
                secretWord = secretWord.replace(letter, "");
                shadowGuessWord = shadowGuessWord.replace(letter, "");
            } //if
        } //loop
        return { total: total, bulls: bulls };
    }; //gameAlgorythm.evaluateBullsAndCowsSolution

    gameAlgorithm.canBeComposedOf = (trialWord, characterRepertoire) => {
		for (let char of trialWord)
			if (characterRepertoire.indexOf(char) < 0)
				return false;
			else
			    characterRepertoire = characterRepertoire.replace(char, "");
		return true;
	}; //gameAlgorithm.canBeComposedOf

    gameAlgorithm.shuffleWord = (word, firstTime) => {
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
	}; //gameAlgorithm.shuffleWord

    return gameAlgorithm;
};
