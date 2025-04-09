/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const game = namespaces.create({

    definitionSet: (() => {

        const leftQuote = language => language.characterRepertoire.quotes[0];
        const rightQuote = language => language.characterRepertoire.quotes[1];
        const notComposed = "cannot be composed based on the given character repertoire";

        const gameDefinitionSet = {
            gameIO: {
                gameSignature: "Words game",
                gameName: "Words",
                gameSuffix: "words",
                suggestedInitialFileName: "saved-words-game.words",
            }, //gameIO
			tooltip: {
				elementTag: "div",
				cssClass: "tooltip",
			}, //tooltip
            invalidOperation: menuItemText =>
                `${menuItemText} (not supported by this browser; please use, for example, Chromium-compatible one)`,
            setWordBad: (language, value) =>
                `<p>Warning:</p><p>${leftQuote(language)}${value}${rightQuote(language)} not found in the ${language.languageName} dictionary</p>`,
            warningFormat: {
                modalPopupOptions: {
                    textAlign: "center",
                    textLineColor: { message: "darkRed", },
                },
            },
            machineSolution: {
                countFormat: count =>
                    count == 0
                        ? `No words found`
                        : `Found ${count} word${count == 1 ? "" : "s"}`,
            },
            trialWordNotInDictionary: (language, value) =>
                `${leftQuote(language)}${value}${rightQuote(language)} not found in the ${language.languageName} dictionary`,
            alreadyFound: (language, value) =>
                `${leftQuote(language)}${value}${rightQuote(language)} is already found`,
            insufficientRepertoire: (language, value) =>
                `The word ${leftQuote(language)}${value}${rightQuote(language)} ${notComposed}`,
            trialWordDoubleBad: (language, value) =>
                `<p>${leftQuote(language)}${value}${rightQuote(language)} not found in the ${language.languageName} dictionary.<p><p>The word ${notComposed}.</p>`
        };
    
        return gameDefinitionSet;  
    
    })(), //definitionSet

}); //game.definitionSet
