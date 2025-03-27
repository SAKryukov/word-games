/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const getGameAlgorythm = languageSelector => {
    const gameAlgorythm = {};

    gameAlgorythm.isInDictionary = word => 
        languageSelector.currentLanguage.alphabetical[word.toLowerCase()] != null;

    return gameAlgorythm;
};