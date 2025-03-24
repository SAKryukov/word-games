/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const dictionaries = { "English": English, "Russian": Russian };

const performAdHocDictionaryMainenance = () => {

    const dictionaryMaintenance = (languageName, newWords) => {
        for (let word of newWords)
            dictionaries[languageName].alphabetical[word] = word.length;
        dictionaries[languageName].indexedByLength = {};
        let array = [];
        for (let index in dictionaries[languageName].alphabetical)
            array.push(index);
        array.sort();
        dictionaries[languageName].alphabetical = {};
        for (let word of array)
            dictionaries[languageName].alphabetical[word] = word.length;
        const json = JSON.stringify(dictionaries[languageName], null, "  ");
        navigator.clipboard.writeText(json);
    }; //dictionaryMaintenance

    dictionaryMaintenance("English", []);

}; //performAdHocDictionaryMainenance
