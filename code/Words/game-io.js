/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const createGameIO = (gameDefinitionSet, sortedWordList, elementSet, languageSelector) => {
    const gameIO = {};

    const fileIO = createFileIO(exception => {
        modalPopup.show(
            gameDefinitionSet.IOErrorFormat.formatException(exception),
            null,
            gameDefinitionSet.IOErrorFormat.modalPopupOptions);
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
        gameData.metadata.options.acceptBlankspaceCharacters = 
            languageSelector.acceptBlankspaceCharactersValue;
        gameData.metadata.options.acceptPunctuationCharacters =
            languageSelector.acceptPunctuationCharactersValue;
        let defaultInitialFileName = null;
        if (fileIO.isFallback)
            defaultInitialFileName = gameefinitionSet.createFileOptions().suggestedName;
        fileIO.storeTextFile(
            defaultInitialFileName,
            sortedWordList.toJSON(gameData),
            gameDefinitionSet.createFileOptions());
    }; //gameIO.saveGame

    gameIO.restoreGame = () => {
        sortedWordList.reset();
        fileIO.loadTextFile((_, text)=> {
            const json = JSON.parse(text);
            if (json.signature != gameDefinitionSet.gameSignature)
                throw new gameDefinitionSet.IOErrorFormat.invalidFileTypeError(
                    gameDefinitionSet.IOErrorFormat.invalidSignatureMessage(json.signature));
            elementSet.input.inputSetWord.value = json.metadata.setWord;
            languageSelector.setLanguage(json.metadata.language);
            languageSelector.setOptionValues(
                json.metadata.options.acceptBlankspaceCharacters,
                json.metadata.options.acceptPunctuationCharacters
            );
            for (let word of json.alphabetical)
                sortedWordList.add(word);
        }, gameDefinitionSet.createFileOptions());
    }; //gameIO.restoreGame

    return gameIO;
};
