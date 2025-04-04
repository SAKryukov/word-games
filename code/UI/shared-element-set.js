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
    const input = {
        languageSet: document.querySelector("#language"),
        options: document.querySelector("#options"),
        buttonActivateMenu: document.querySelector("#button-activate-menu"),
        menu: document.querySelector("#menu"),
    };
    const product = {
        title: document.querySelector("#product-title"),
        version: document.querySelector("#product-version"),
        copyrightYears: document.querySelector("#product-copyright-years"),
    };

    Object.defineProperties(elementSet, {
        main: {
            get() { return mainElement; },
        },
        input: {
            get() { return input; },
        },

    });

	(() => { // product:
		product.title.textContent = shared.definitionSet.title;
		product.version.innerHTML = shared.definitionSet.version;
		product.copyrightYears.textContent = shared.definitionSet.copyrightYears;
	})(); //product

    return elementSet;

} //getSharedElementSet

