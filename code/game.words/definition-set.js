/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const getDefinitionSet = () => {
    const gameDefinitionSet = {};

    gameDefinitionSet.gameIO = {
        gameSignature: "Words game",
        gameName: "Words game",
        suggestedInitialFileName: "saved-words-game.words",
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
        maitenanceCompletionMessage: function () {
            return `<p>${this.menuItemText} complete.</p><p>The resulting dictionary definition is in the clipboard.</p>`;
        },
    }; //gameDefinitionSet.dictionaryMaintenance

    gameDefinitionSet.machineSolution = {
        countFormat: count =>
            count == 0
                ? `No words found`
                : `Found ${count} word${count == 1 ? "" : "s"}`,
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
