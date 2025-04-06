/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const dictionary = namespaces.create({    
    definitionSet: (() => {

        const definitionSet = {
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
                culture: 0,
                alphabetical: 0,
                indexedByLength: 0,
                characterRepertoire: 0,
                    characters: 0,
                    letters: 0,
                    vowels: 0,
                    consonants: 0,
                    punctuation: 0,
                    blankSpace: 0,
                    quotes: 0,
            }, //propertyName
            notUnique: {
                dictionary: languageName =>
                    `Dictionary "${languageName}" already exists`,
                dictionaryName: languageName =>
                    `Dictionary with the name "${languageName}" already exists`,
            },
            alertText: (message, script) =>
                `${message}\n\nFix the script\n${script}`,
            alertTextUnknownScript: message =>
                `${message}`,    
        }; //definitionSet

        const rebuildNames = instance => {
            for (let index in instance)
                instance[index] = index;
        }; //rebuildNames
        rebuildNames(definitionSet.propertyName);

        return definitionSet;

    })(),
}); //dictionary.definitionSet
