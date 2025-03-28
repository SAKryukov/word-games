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
    elementSet.input.buttonActivateMenu = sharedElementSet.buttonActivateMenu;
    elementSet.input.menu = sharedElementSet.menu;
    elementSet.input.buttonStartStop = document.querySelector("#buttonStartStop");
    const buttonStartContent = elementSet.input.buttonStartStop.innerHTML;
    const buttonStopContent = elementSet.input.buttonStartStop.dataset.secondContent;

    const enableInput = doEnable => {
        elementSet.input.languageSet.disabled = !doEnable;
        elementSet.input.options.disabled = !doEnable;   
        elementSet.input.wordLength.disabled = !doEnable;    
    } //enableInput

    let message = document.querySelector("main p");
    const initialMessage = message.innerHTML;
    let isButtonStartReady = true;
    Object.defineProperties(elementSet, {
        isButtonStartReady: {
            get() { return isButtonStartReady; }
        },
        message: {
            set(value) { message.innerHTML = value == null ? initialMessage : value; }
        },
    }); //Object.defineProperties

    elementSet.input.onButtonStartStopToggle = readyToStart => {       
        isButtonStartReady = !isButtonStartReady;
        enableInput(isButtonStartReady);
        elementSet.input.buttonStartStop.innerHTML = isButtonStartReady
            ? buttonStartContent
            : buttonStopContent;
        readyToStart = isButtonStartReady;
    } //elementSet.input.onButtonStart

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

    elementSet.menuItem = {
        startGame: elementSet.input.menu.children[0].textContent,
        giveUp: elementSet.input.menu.children[1].textContent,
        revealSolution: elementSet.input.menu.children[2].textContent,
    };

    return elementSet;
};
