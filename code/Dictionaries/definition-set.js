/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const dictionary = namespaces.create({
    
    definitionSet: {

        invalidDictionary: {
            dictionary: "Dictionary is not defined",             
            name: "Dictionary should have the property languageName",
            property: (languageName, propertyName) =>
                `Dictionary "${languageName}" should have the property ${propertyName}`,
            alphabetical: languageName =>
                `Dictionary "${languageName}" should have the property alphabetical, array or words`,
            quotesLength: languageName =>
                `For the dictionary "${languageName}", the property characterRepertoire.quotes should have at least one pair of quotation marks`,
        }, //invalidDictionary
        propertyName: {
            culture: "culture",
            alphabetical: "alphabetical",
            indexedByLength: "indexedByLength",
            characterRepertoire: "characterRepertoire",
            characters: "characters",
            letters: "letters",
            vowels: "vowels",
            consonants: "consonants",
            punctuation: "punctuation",
            blankSpace: "blankSpace",
            quotes: "quotes",
        },
        alertText: (message, script) =>
            `${message}\n\nFix the script\n${script}`,
        alertTextUnknownScript: message =>
            `${message}`,

    }, //definitionSet

}); //dictionary.definitionSet
