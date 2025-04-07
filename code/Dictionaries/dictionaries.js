/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const dictionaries = (() => {

    const set = new Set();
    const list = [];
    const byName = {};
    const byCulture = {};

    const stopAll = message => {
        const scriptFile = document.currentScript.src;
        window.stop();
        throw new Error(
            scriptFile == null
            ? dictionary.definitionSet.alertTextUnknownScript(message)
            : dictionary.definitionSet.alertText(message, scriptFile)
        );
    }; //stopAll

    const testDictionary = dictionaryInstance => {
        try {
            if (!dictionaryInstance)
                stopAll(dictionary.definitionSet.invalidDictionary.dictionary);
            if (!dictionaryInstance.languageName)
                stopAll(dictionary.definitionSet.invalidDictionary.name);
            if (!dictionaryInstance.culture)
                stopAll(
                    dictionary.definitionSet.invalidDictionary.property(dictionaryInstance.languageName,
                        dictionary.definitionSet.propertyName.culture));
            if (!dictionaryInstance.characterRepertoire)
                stopAll(
                    dictionary.definitionSet.invalidDictionary.property(dictionaryInstance.languageName,
                        dictionary.definitionSet.propertyName.characterRepertoire));
            if (!dictionaryInstance.characterRepertoire.characters)
                stopAll(
                    dictionary.definitionSet.invalidDictionary.property(dictionaryInstance.languageName,
                        dictionary.definitionSet.propertyName.characters));
            if (dictionaryInstance.characterRepertoire.letters == null)
                stopAll(
                    dictionary.definitionSet.invalidDictionary.property(dictionaryInstance.languageName,
                        dictionary.definitionSet.propertyName.letters));
            if (dictionaryInstance.characterRepertoire.letters.length > 0) {
                if (dictionaryInstance.characterRepertoire.vowels == null)
                    stopAll(
                        dictionary.definitionSet.invalidDictionary.property(dictionaryInstance.languageName,
                            dictionary.definitionSet.propertyName.vowels));
                if (dictionaryInstance.characterRepertoire.consonants == null)
                    stopAll(
                        dictionary.definitionSet.invalidDictionary.property(dictionaryInstance.languageName,
                            dictionary.definitionSet.propertyName.consonants));
                if (!dictionaryInstance.alphabetical)
                    stopAll(dictionary.definitionSet.invalidDictionary.alphabetical(dictionaryInstance.languageName));
                if (!dictionaryInstance.indexedByLength)
                    stopAll(
                        dictionary.definitionSet.invalidDictionary.property(dictionaryInstance.languageName,
                            dictionary.definitionSet.propertyName.indexedByLength));
            } //if letters
            if (dictionaryInstance.characterRepertoire.punctuation == null)
                stopAll(
                    dictionary.definitionSet.invalidDictionary.property(dictionaryInstance.languageName,
                        dictionary.definitionSet.propertyName.punctuation));
            if (dictionaryInstance.characterRepertoire.blankSpace == null)
                stopAll(
                    dictionary.definitionSet.invalidDictionary.property(dictionaryInstance.languageName,
                        dictionary.definitionSet.propertyName.blankSpace));
            if (!dictionaryInstance.characterRepertoire.quotes)
                stopAll(
                    dictionary.definitionSet.invalidDictionary.property(dictionaryInstance.languageName,
                        dictionary.definitionSet.propertyName.quotes));
            if (dictionaryInstance.characterRepertoire.quotes.length < 2)
                stopAll(dictionary.definitionSet.invalidDictionary.quotesLength(dictionaryInstance.languageName));
            if (set.has(dictionaryInstance))
                stopAll(dictionary.definitionSet.notUnique.dictionary(dictionaryInstance.languageName));
            if (byName[dictionaryInstance.languageName])
                stopAll(dictionary.definitionSet.notUnique.dictionaryName(dictionaryInstance.languageName));
        } catch (ex) {
            alert(ex.message);
        } //exception
    }; //testDictionary

    const add = dictionary => {
        testDictionary(dictionary);
        list.push(dictionary);
        set.add(dictionary);
        byName[dictionary.languageName] = dictionary;
        byCulture[dictionary.culture] = dictionary;
    }; //add

    const dictinaries = namespaces.create({
        add: add,
        list: list,
        set: set,
        byName: byName,
        byCulture: byCulture,
    }, false);
    Object.freeze(namespaces);
    return dictinaries;

})();
