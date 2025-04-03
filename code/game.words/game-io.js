/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const createGameIO = (sortedWordList, elementSet, languageSelector, gameDefinitionSet, gameAlgorithm) => {
    const gameIO = {};

    const dictionaryIO = createDictionartyIO(
        languageSelector,
        gameDefinitionSet.gameIO.gameSignature,
        gameDefinitionSet.gameIO.suggestedInitialFileName,
        gameDefinitionSet.gameIO.gameName,
        gameDefinitionSet.gameIO.gameSuffix,
        gameData => { //onSave
            gameData.setWord = elementSet.input.inputSetWord.value;
            sortedWordList.updateGameData(gameData);
        }, //onSave
        gameData => { //onLoad
            elementSet.input.inputSetWord.value = gameData.setWord;
            for (let word of gameData.alphabetical)
                sortedWordList.add(word);
            gameIO.shuffleAndClassify(true);
        } //onLoad
    ); //dictionaryIO

    gameIO.shuffleAndClassify = firstTime => {
        const word = elementSet.input.inputSetWord.value;
        elementSet.textShuffle.textContent =
            gameAlgorithm.shuffleWord(word, firstTime).toUpperCase();
        elementSet.textClassify.textContent =
            gameAlgorithm.classifyWord(word).toUpperCase();
    } //gameIO.shuffleAndClassify

    gameIO.saveGame = (currentLanguage, useExistingFile) => {
        dictionaryIO.saveGame(currentLanguage, useExistingFile);
    }; //gameIO.saveGame

    gameIO.restoreGame = () => {
        sortedWordList.reset();
        dictionaryIO.restoreGame();
    }; //gameIO.restoreGame

    return gameIO;
};
