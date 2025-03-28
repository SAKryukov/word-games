/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const getGameAlgorithm = languageSelector => {
    const gameAlgorithm = {};

    gameAlgorithm.isInDictionary = word =>
        dictionaryUtility.binarySearch(languageSelector.currentLanguage.alphabetical, word.toLowerCase()) != null;

    gameAlgorithm.generateSecretWord = length => {
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
    }; //gameAlgorythm.generateSecretWord

    gameAlgorithm.evaluateSolution = (secretWord, guessWord, removeDuplicates) => {
        let bulls = 0;
        guessWord = guessWord.toLowerCase();
        for (let index = 0; index < secretWord.length; ++index)
            if (secretWord[index] == guessWord[index])
                ++bulls;
        if (bulls == guessWord.length)
            return { total: bulls, bulls: bulls };
        let total = 0;
        if (removeDuplicates) {
            const letterSet = new Set(guessWord.split(""));
            letterSet.forEach(letter => {
                if (secretWord.includes(letter))
                    ++total;
            });
        } else
            for (let index = 0; index < secretWord.length; ++index)
                if (secretWord.includes(guessWord[index]))
                    ++total;
        return { total: total, bulls: bulls };
    } //gameAlgorythm.evaluateSolution

    return gameAlgorithm;
};
