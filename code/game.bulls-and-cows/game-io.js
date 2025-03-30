/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const createGameIO = (gameDefinitionSet, languageSelector, onSave, onLoad) => {
    const gameIO = {};

    const dictionaryIO = createDictionartyIO(
        languageSelector,
        gameDefinitionSet.gameIO.gameSignature,
        gameDefinitionSet.gameIO.suggestedInitialFileName,
        gameDefinitionSet.gameIO.gameName,
        gameDefinitionSet.gameIO.gameSuffix,
        onSave, onLoad
    ); //dictionaryIO

    gameIO.saveGame = (currentLanguage, useExistingFile) => {
        dictionaryIO.saveGame(currentLanguage, useExistingFile);
    }; //gameIO.saveGame

    gameIO.restoreGame = () => {
        dictionaryIO.restoreGame();
    }; //gameIO.restoreGame

    return gameIO;
};
