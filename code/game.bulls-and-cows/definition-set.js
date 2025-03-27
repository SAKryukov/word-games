/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const getGameDefinitionSet = () => {
    const gameDefinitionSet = {};

    gameDefinitionSet.input = {};

    gameDefinitionSet.input.wordLength = {
        minimum: 2,
        maximum: 9,
        default: 4,
        size: 4,
        indexFromValue: function(value) { return value - this.minimum; },
        valueFromIndex: function(index) { return this.minimum + index; },
    }; //gameDefinitionSet.input.wordLength

    return gameDefinitionSet;
};