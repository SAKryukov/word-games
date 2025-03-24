/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const getElementSet = () => {
    const elementSet = {};
    
    elementSet.main = document.querySelector("main");
    elementSet.input = {};
    elementSet.input.languageSet = document.querySelector("#language");
    elementSet.input.options = document.querySelector("#options");
    elementSet.input.inputSetWord = document.querySelector("#input-set-word");
    elementSet.input.inputTry = document.querySelector("#input-try");
    elementSet.input.menu = document.querySelector("#menu");
    elementSet.input.buttonActivateMenu = document.querySelector("#button-activate-menu");
    elementSet.textShuffle = document.querySelector("#text-shuffle");
    elementSet.buttonShuffle = document.querySelector("#button-shuffle");
    elementSet.count = document.querySelector("#count");
    elementSet.characterCount = document.querySelector("#character-count");
    elementSet.buttonPrototype = document.querySelector("#button-prototype");

    elementSet.product = {};
    elementSet.product.title = document.querySelector("#product-title");
    elementSet.product.version = document.querySelector("#product-version");
    elementSet.product.copyrightYears = document.querySelector("#product-copyright-years");

    elementSet.menuItem = {};
    elementSet.menuItem.reviewMachineSolution = elementSet.input.menu.children[0].textContent;
    elementSet.menuItem.saveGame = elementSet.input.menu.children[1].textContent;
    elementSet.menuItem.loadGame = elementSet.input.menu.children[2].textContent;

    elementSet.showInputTry = () => {
        elementSet.input.inputTry.style.visibility = "visible";
        elementSet.input.inputTry.focus();
    };
    elementSet.hideInputTry = () => {
        elementSet.input.inputTry.style.visibility = "hidden";
        elementSet.input.inputSetWord.focus();
    };
    elementSet.isEnter = event => event.key == "Enter";
    elementSet.highlightClass = "highlight";
    elementSet.keyShuffle = "u";
    elementSet.keyShuffleReset = "r";
    elementSet.isKeyShuffleRelated = event => event.key == "u" || event.key == "r";
    elementSet.makeEqualWidth = element => element.style.width = `${element.offsetHeight}px`;
    elementSet.makeEqualHeight = () => {
        const height = Math.max(elementSet.input.options.offsetHeight, elementSet.input.languageSet.offsetHeight);
        const heightPx = `${height}px`;
        elementSet.input.languageSet.style.height = heightPx;
        elementSet.input.options.style.height = heightPx;
    };

    elementSet.selectInSelect = (select, value) => {
        for (let index = 0; index < select.childElementCount; ++index)
            if (select.children[index].value == value) {
                select.selectedIndex = index;
                return;
            } //if
    }; //elementSet.selectInSelect
    
    return elementSet;
};

