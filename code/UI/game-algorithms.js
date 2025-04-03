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

    let longerRandomWordCache = [];
    gameAlgorithm.pickLongerRandomWord = length => { // balda
        if (length != longerRandomWordCache.length) {
            longerRandomWordCache = [];
            const indexedByLength = languageSelector.currentLanguage.indexedByLength;
            for (let index = length + 2; index < Object.getOwnPropertyNames(indexedByLength).length; ++index) {
                const arrayAtLength = indexedByLength[index];
                if (!arrayAtLength) break;
                for (let wordIndex in arrayAtLength)
                    longerRandomWordCache.push(arrayAtLength[wordIndex]);
            } //loop
        } //if
        if (!longerRandomWordCache || longerRandomWordCache.length < 1) return "";
        const generateIt = () => {
            const randomIndex = Math.floor(Math.random() * longerRandomWordCache.length);
            return languageSelector.currentLanguage.alphabetical[longerRandomWordCache[randomIndex]];
        }; //generateIt
        let word = null;
        while (true) {
            word = generateIt();
            if (goodWord(word)) break;
        } //loop
        return word;
    }; //gameAlgorithm.pickLongerRandomWord

    gameAlgorithm.getRandomSubstring = (value, length) => {
        const maximum = value.length - length;
        const randomIndex =  Math.floor(Math.random(), maximum);
        return value.substr(randomIndex, length);
    }; //gameAlgorithm.getRandomSubstring

    gameAlgorithm.pickRandomWord = length => { // bulls and cows
        const generateIt = () => {
            const indexArray = languageSelector.currentLanguage.indexedByLength[length];
            if (!indexArray) return null;
            const indexLength = indexArray.length;
            if (indexLength < 1) return null;
            const randomIndex = Math.floor(Math.random() * indexLength);
            const index = indexArray[randomIndex];
            return languageSelector.currentLanguage.alphabetical[index];  
        }; // generateIt
        let word = null;
        while (true) {
            word = generateIt();
            if (goodWord(word))
                return word;
        } //loop
    }; //gameAlgorythm.pickRandomWord

    gameAlgorithm.isValidCharacter = character => {
        if (!character) return false;
        if (character.length < 1) return false;
        return goodWord(character);
    }; //gameAlgorithm.isValidCharacter

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

    gameAlgorithm.classifyWord = word => {
        if (!word) return word;
        if (word.length < 2) return word;
        let vowels = [], consonants = [], modifierLetters = [], diacritic = [], punctuation = [];
        for (let index = 0; index < word.length; ++index) {
            const letter = word[index];
            if (languageSelector.currentLanguage.characterRepertoire.vowels.indexOf(letter) >= 0)
                vowels.push(letter);
            if (languageSelector.currentLanguage.characterRepertoire.consonants.indexOf(letter) >= 0)
                consonants.push(letter);
            if (languageSelector.currentLanguage.characterRepertoire.modifierLetters.indexOf(letter) >= 0)
                modifierLetters.push(letter);
            if (languageSelector.currentLanguage.characterRepertoire.diacritic.indexOf(letter) >= 0)
                diacritic.push(letter);
            if (languageSelector.currentLanguage.characterRepertoire.punctuation.indexOf(letter) >= 0)
                punctuation.push(letter);
        } //loop
        const classificationResult = [];
        for (let subset of [vowels, consonants, modifierLetters, diacritic, punctuation]) {
            if (subset.length > 0)
                classificationResult.push(subset.sort().join(""));
        } //loop
        return classificationResult.join(" ");
    } //gameAlgorithm.classifyWord

    Object.defineProperties(gameAlgorithm, {
        randomLetter: {
            get() {
                let repertoire;
                repertoire += languageSelector.currentLanguage.characterRepertoire.letters;
                if (languageSelector.acceptBlankspaceCharactersValue)
                    repertoire += languageSelector.currentLanguage.characterRepertoire.blankSpace;
                if (languageSelector.acceptPunctuationCharactersValue)
                    repertoire += languageSelector.currentLanguage.characterRepertoire.punctuation;
                return repertoire[Math.floor(Math.random() * repertoire.length)];
            }
        }, //randomLetter
    }); //Object.defineProperties

    return gameAlgorithm;
};
