/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const createGameIO = (gameDefinitionSet, sortedWordList, elementSet, optionsObject) => {
    const gameIO = {};

    const fileIO = createFileIO(exception => {
        alert(exception.toString()); //SA???
    });

    if (!fileIO)
        return undefined;

    const gameData = {
        signature: gameDefinitionSet.gameSignature,
        metadata: {
            language: null,
            options: {
                acceptBlankspaceCharacters: false,
                acceptPunctuationCharacters: false,
            },  
            setWord: null,
        },
    }; //gameData

    gameIO.saveGame = currentLanguage => {
        gameData.metadata.language = currentLanguage.languageName;
        gameData.metadata.setWord = elementSet.input.inputSetWord.value;
        const options = optionsObject.getValues();
        gameData.metadata.options.acceptBlankspaceCharacters = options[0];
        gameData.metadata.options.acceptPunctuationCharacters = options[1];
        let defaultInitialFileName = null;
        if (fileIO.isFallback)
            defaultInitialFileName = gameDefinitionSet.createFileOptions().suggestedName;
        fileIO.storeTextFile(
            defaultInitialFileName,
            sortedWordList.toJSON(gameData),
            gameDefinitionSet.createFileOptions());
    }; //gameIO.saveGame

    gameIO.restoreGame = () => {
        sortedWordList.reset();
        fileIO.loadTextFile((_, text)=> {
            const json = JSON.parse(text);
            elementSet.input.inputSetWord.value = json.metadata.setWord;
            elementSet.selectInSelect(elementSet.input.languageSet, json.metadata.language);
            const optionValues = [
                json.metadata.options.acceptBlankspaceCharacters,
                json.metadata.options.acceptPunctuationCharacters,                
            ];
            optionsObject.setValues(optionValues);
            for (let word of json.alphabetical)
                sortedWordList.add(word);
        }, gameDefinitionSet.createFileOptions());
    }; //gameIO.restoreGame

    return gameIO;
};
