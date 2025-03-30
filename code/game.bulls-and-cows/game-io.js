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

    gameIO.restoreGame.obfuscate = word => {
        const data = [];
        for (let index = 0; index < word.length; ++index)
            data.push((word.codePointAt(index) ^ gameDefinitionSet.gameIO.obfuscationSeed).toString());
        return data.join(gameDefinitionSet.gameIO.delimiter);
    }; //gameIO.restoreGame.obfuscate
    gameIO.restoreGame.deobfuscate = data => {
        const word = [];
        const numbers = data.split(gameDefinitionSet.gameIO.delimiter);
        for (let number of numbers)
            word.push(String.fromCodePoint(parseInt(number) ^ gameDefinitionSet.gameIO.obfuscationSeed));
        return word.join(gameDefinitionSet.gameIO.empty);
    }; //gameIO.restoreGame.deobfuscate

    return gameIO;
};
