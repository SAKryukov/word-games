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
        languageSelector.currentLanguage.alphabetical[word.toLowerCase()] != null;

    gameAlgorithm.generateSecretWord = length => {
        const wordArray = [];
        for (let word in languageSelector.currentLanguage.alphabetical)
            if (word.length === length)
                wordArray.push(word);
        const index = Math.floor(Math.random() * wordArray.length);
        return wordArray[index];
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