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
        },
        gameData => { //onLoad
            elementSet.input.inputSetWord.value = gameData.setWord;
            for (let word of gameData.alphabetical)
                sortedWordList.add(word);
            elementSet.textShuffle.textContent =
                gameAlgorithm.shuffleWord(elementSet.input.inputSetWord.value.toUpperCase(), true);
        }
    ); //dictionaryIO

    gameIO.saveGame = (currentLanguage, useExistingFile) => {
        dictionaryIO.saveGame(currentLanguage, useExistingFile);
    }; //gameIO.saveGame

    gameIO.restoreGame = () => {
        sortedWordList.reset();
        dictionaryIO.restoreGame();
    }; //gameIO.restoreGame

    return gameIO;
};
