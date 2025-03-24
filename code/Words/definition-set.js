/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const getDefinitionSet = () => {
    const definitionSet = {};

    definitionSet.gameSignature = "Words game";
    definitionSet.createFileOptions = () => {
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

    const leftQuote = language => language == dictionaries.Russian ? "&laquo;" : "&ldquo;";
    const rightQuote = language => language == dictionaries.Russian ? "&raquo;" : "&rdquo;";
    const notComposed = "cannot be composed based on the given character repertoire";

    definitionSet.setWordBad = (language, value) => 
        `<p style="text-align: center">Warning!</p><p>${leftQuote(language)}${value}${rightQuote(language)} not found in the ${language.languageName} dictionary</p>`;
    definitionSet.trialWordNotInDictionary = (language, value) => 
        `${leftQuote(language)}${value}${rightQuote(language)} not found in the ${language.languageName} dictionary`;
    
    definitionSet.alreadyFound = (language, value) =>
        `${leftQuote(language)}${value}${rightQuote(language)} is already found`;

    definitionSet.insufficientRepertoire = (language, value) =>
        `The word ${leftQuote(language)}${value}${rightQuote(language)} ${notComposed}`;

    definitionSet.trialWordDoubleBad = (language, value) =>
        `<p>${leftQuote(language)}${value}${rightQuote(language)} not found in the ${language.languageName} dictionary.<p><p>The word ${notComposed}.</p>`;

    return definitionSet;
};