/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const dictionaries = { "English": English, "Russian": Russian };

const performAdHocDictionaryMainenance = () => {

    const compactMode = true;

    const spacer = compactMode ? null : "  ";

    const wrap = (languageName, json) =>
       `"use strict";\nconst ${languageName} =\n${json};`;
    
    const dictionaryMaintenance = (languageName, addWords, removeWords) => {
        const dictionary = dictionaries[languageName];
        const wordSet = new Set(dictionary.alphabetical);
        if (removeWords != null)
            for (let word of removeWords)
                wordSet.delete(word);
        if (addWords != null)
            for (let word of addWords)
                wordSet.add(word);
        const array = [];
        wordSet.forEach(word => array.push(word));
        array.sort();
        dictionary.alphabetical = array;
        dictionary.indexedByLength = {};
        for (let index = 0; index < array.length; ++index) {
            const word = array[index];
            if (dictionary.indexedByLength[word.length] == null)
                dictionary.indexedByLength[word.length] = [];
            dictionary.indexedByLength[word.length].push(index);
        } //loop
        const json = JSON.stringify(dictionaries[languageName], null, spacer);
        navigator.clipboard.writeText(wrap(languageName, json));
    }; //dictionaryMaintenance

    const transform = languageName => {
        const json = JSON.stringify(dictionaries[languageName], null, spacer);
        navigator.clipboard.writeText(wrap(languageName, json));
    }; //transform

    dictionaryMaintenance("Russian", [], []);
    //transform("English");

}; //performAdHocDictionaryMainenance
