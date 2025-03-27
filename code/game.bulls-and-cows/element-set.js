/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const getElementSet = definitionSet => {
    const elementSet = {};

    const sharedElementSet = getSharedElementSet();
    elementSet.main = sharedElementSet.main;
    elementSet.input = {};
    elementSet.input.languageSet = sharedElementSet.languageSet;
    elementSet.input.options = sharedElementSet.options;

    elementSet.input.wordLength = document.querySelector("#word-length");
    for (let length = definitionSet.input.wordLength.minimum; length <= definitionSet.input.wordLength.maximum; ++length) {
        const option = document.createElement("option");
        option.textContent = length.toString();
        elementSet.input.wordLength.appendChild(option);
    } //loop
    elementSet.input.wordLength.size = definitionSet.input.wordLength.size;
    elementSet.input.wordLength.selectedIndex =
        definitionSet.input.wordLength.indexFromValue(
            definitionSet.input.wordLength.default);

    return elementSet;
};
