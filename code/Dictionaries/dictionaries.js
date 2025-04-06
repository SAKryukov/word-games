/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const dictionaries = { "English": English, "Russian": Russian };

const dictionaryIndex = (() => {
    const indexedByCulture = {};
    for (let index in dictionaries)
        indexedByCulture[dictionaries[index].culture] = dictionaries[index];
    const result = { indexedByCulture: indexedByCulture, indexedByName: dictionaries };
    Object.freeze(indexedByCulture);
    Object.freeze(dictionaries);
    Object.freeze(result);
    return result;
})();
