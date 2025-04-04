/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const createDictionartyIO = (languageSelector, signature, suggestedInitialFileName, gameName, gameSuffix, onSave, onLoad) => {
    // callback onSave(gameData); // take game data and add game-specific info, such as secret work and word list
    // onLoad(gameData); // extract game-specific info from game data and update UI

    const gameIO = {};
    
    const fileIO = createFileIO(exception => {
        modalPopup.show(
            IO.definitionSet.IOErrorFormat.formatException(exception),
            null,
            IO.definitionSet.IOErrorFormat.modalPopupOptions);
    });

    if (!fileIO)
        return undefined;

    const createGameData = () => {
        const gameData = {
            signature: signature,
            metadata: {
                language: null,
                options: {
                    acceptBlankspaceCharacters: false,
                    acceptPunctuationCharacters: false,
                },
            },
        };
        onSave(gameData);
        return gameData;
    }; //createGameData

    gameIO.saveGame = (currentLanguage, useExistingFile) => {
        const gameData = createGameData();
        gameData.metadata.language = currentLanguage.languageName;
        gameData.metadata.options.acceptBlankspaceCharacters =
            languageSelector.acceptBlankspaceCharactersValue;
        gameData.metadata.options.acceptPunctuationCharacters =
            languageSelector.acceptPunctuationCharactersValue;
        let defaultInitialFileName = null;
        if (fileIO.isFallback)
            defaultInitialFileName = suggestedInitialFileName;
        const stringData = JSON.stringify(gameData);
        if (useExistingFile)
            fileIO.saveExisting(
                defaultInitialFileName,
                stringData,
                IO.definitionSet.createFileOptions(suggestedInitialFileName, gameName, gameSuffix));
        else
            fileIO.storeTextFile(
                defaultInitialFileName,
                stringData,
                IO.definitionSet.createFileOptions(suggestedInitialFileName, gameName, gameSuffix));
    }; //gameIO.saveGame

    gameIO.restoreGame = () => {
        fileIO.loadTextFile((_, text) => {
            const json = JSON.parse(text);
            if (json.signature != signature)
                throw new IO.definitionSet.IOErrorFormat.invalidFileTypeError(
                    IO.definitionSet.IOErrorFormat.invalidSignatureMessage(signature));
            languageSelector.setLanguage(json.metadata.language);
            languageSelector.setOptionValues(
                json.metadata.options.acceptBlankspaceCharacters,
                json.metadata.options.acceptPunctuationCharacters
            );
            onLoad(json);
        }, IO.definitionSet.createFileOptions(suggestedInitialFileName, gameName, gameSuffix));
    }; //gameIO.restoreGame

    return gameIO;
};
