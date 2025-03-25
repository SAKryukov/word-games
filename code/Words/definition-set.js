/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const getDefinitionSet = () => {
    const gameDefinitionSet = {};

    gameDefinitionSet.gameSignature = "Words game";
    gameDefinitionSet.createFileOptions = () => {
        return {
            suggestedName: "saved-words-game.words",
            id: "saved-words-game", //SA??? does not work
            types: [
                {
                    description: "JSON file or Words file",
                    accept: { "application/ecmascript": [".words", ".json"] },
                }
            ]
        };
    }; //definitionSet.createFileOptions

    function InvalidFileTypeError(message = "") {
        this.name = "Invalid file type error";
        this.message = message;
    } //InvalidFileTypeError
    InvalidFileTypeError.prototype = Error.prototype;    

    gameDefinitionSet.IOErrorFormat = {
        formatException: exception => `<p>${exception.name}<br/><br/>${exception.message}</p>`,
        modalPopupOptions: {
            textAlign: "center",
            textLineColor: { message: "red", },
            backgroundColor: { message: "lightYellow", },
        },
        invalidSignatureMessage: signature => `Invalid file signature: ${signature}`,
        invalidFileTypeError: InvalidFileTypeError,
    };

    gameDefinitionSet.invalidOperation = menuItemText => 
        `${menuItemText} (not supported by this browser; please use, for example, Chromium-compatible one)`;

    const leftQuote = language => language == dictionaries.Russian ? "&laquo;" : "&ldquo;";
    const rightQuote = language => language == dictionaries.Russian ? "&raquo;" : "&rdquo;";
    const notComposed = "cannot be composed based on the given character repertoire";

    gameDefinitionSet.setWordBad = (language, value) => 
        `<p>Warning:</p><p>${leftQuote(language)}${value}${rightQuote(language)} not found in the ${language.languageName} dictionary</p>`;
    gameDefinitionSet.WarningFormat = {
        modalPopupOptions: {
            textAlign: "center",
            textLineColor: { message: "darkRed", },
        },
    };

    gameDefinitionSet.dictionaryMaintenance = {
        urlKeyword: "maintenance", // use in the browser address line: ...words.html?maintenance
        menuItemText: "Dictionary Maintenance", 
        createOption: () => document.createElement("option"),
        maitenanceCompletionMessage: function() {
            return `<p>${this.menuItemText} complete.</p><p>The resulting dictionary definition is in the clipboard.</p>`;
        },
    }; //gameDefinitionSet.dictionaryMaintenance

    gameDefinitionSet.machineSolution = {
        countFormat: count => 
            count == 0
            ? `No words found`
            : `Found ${count} word${ count == 1 ? "" : "s" }`,
        warningFormat: "<p>You may want to save your current game in a file first.</p><p>Do you want to proceed?</p>",
        buttonContinue: "Continue",
        buttonCancel: "Cancel",
    }, //gameDefinitionSet.machineSolution

    gameDefinitionSet.trialWordNotInDictionary = (language, value) => 
        `${leftQuote(language)}${value}${rightQuote(language)} not found in the ${language.languageName} dictionary`;
    
    gameDefinitionSet.alreadyFound = (language, value) =>
        `${leftQuote(language)}${value}${rightQuote(language)} is already found`;

    gameDefinitionSet.insufficientRepertoire = (language, value) =>
        `The word ${leftQuote(language)}${value}${rightQuote(language)} ${notComposed}`;

    gameDefinitionSet.trialWordDoubleBad = (language, value) =>
        `<p>${leftQuote(language)}${value}${rightQuote(language)} not found in the ${language.languageName} dictionary.<p><p>The word ${notComposed}.</p>`;

    return gameDefinitionSet;
};