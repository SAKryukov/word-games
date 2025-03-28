/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const getSharedElementSet = () => {

    const elementSet = {};

    const mainElement = document.querySelector("main");
    const languageSetElement = document.querySelector("#language");
    const optionsElement = document.querySelector("#options");
    const buttonActivateMenu = document.querySelector("#button-activate-menu");
    const menu = document.querySelector("#menu");

    Object.defineProperties(elementSet, {
        main: {
            get() { return mainElement; },
        },
        languageSet: {
            get() { return languageSetElement; },
        },
        options: {
            get() { return optionsElement; },
        },
        buttonActivateMenu: {
            get() { return buttonActivateMenu; },
        },
        menu: {
            get() { return menu; },
        },
    });

    return elementSet;

} //getSharedElementSet

