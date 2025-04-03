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
    elementSet.input = {
        languageSet: sharedElementSet.languageSet,
        wordsToRemove: document.querySelector("#to-remove"),
        wordsToAdd: document.querySelector("#to-add"),
        buttonStart: document.querySelector("#button-start"),
    };

    elementSet.product = {
        title: document.querySelector("#product-title"),
        version: document.querySelector("#product-version"),
        copyrightYears: document.querySelector("#product-copyright-years"),
    };

    return elementSet;
};
