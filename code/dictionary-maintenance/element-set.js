/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const getElementSet = () => {
    const elementSet = getSharedElementSet();

    elementSet.input.wordsToRemove = document.querySelector("#to-remove");
    elementSet.input.wordsToAdd = document.querySelector("#to-add");
    elementSet.input.buttonStart = document.querySelector("#button-start");
    elementSet.input.buttonStart.tabIndex = 0;

    elementSet.output = {
        containerRemovedWords: document.querySelector("#removed-words"),
        valueRemovedWords: document.querySelector("#removed-words input"),
        containerNotRemovedWords: document.querySelector("#not-removed-words"),
        valueNotRemovedWords: document.querySelector("#not-removed-words input"),
        containerAddedWords: document.querySelector("#added-words"),
        valueAddedWords: document.querySelector("#added-words input"),
        containerAlreadyAddedWords: document.querySelector("#already-added-words"),
        valueAlreadyAddedWords: document.querySelector("#already-added-words input"),
        containerBadWords: document.querySelector("#bad-words"),
        valueBadWords: document.querySelector("#bad-words input"),
    };

    return elementSet;
};
