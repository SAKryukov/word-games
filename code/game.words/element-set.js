/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const getElementSet = () => {
    const elementSet = {};
    
    const main = document.querySelector("main");
    elementSet.userSolution = document.querySelector("#user-solution");
    elementSet.machineSolution = document.querySelector("#machine-solution");
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
    elementSet.menuItem.viewMachineSolutionCount = elementSet.input.menu.children[0].textContent;
    elementSet.menuItem.reviewMachineSolution = elementSet.input.menu.children[1].textContent;
    elementSet.menuItem.backToUserSolution = elementSet.input.menu.children[2].textContent;
    elementSet.menuItem.saveGameInExistingFile = elementSet.input.menu.children[3].textContent;
    elementSet.menuItem.saveGame = elementSet.input.menu.children[4].textContent;
    elementSet.menuItem.loadGame = elementSet.input.menu.children[5].textContent;

    let machineSolutionBackrgoundColor = null, userSolutionSolutionBackrgoundColor = null;
    main.title = elementSet.userSolution.title;
    let showingUserSolution = true;
    Object.defineProperties(elementSet, {
        isUserSolutionShown: {
            get() { return showingUserSolution; },
            enumerable: true, 
        }
    }); //Object.defineProperties

    elementSet.showInputTry = () => {
        elementSet.input.inputTry.style.visibility = "visible";
        elementSet.input.inputTry.focus();
    }; //elementSet.showInputTry
    elementSet.hideInputTry = () => {
        elementSet.input.inputTry.style.visibility = "hidden";
        elementSet.input.inputSetWord.focus();
    }; //elementSet.hideInputTry

    elementSet.showUserSolution = callback => {
        if (userSolutionSolutionBackrgoundColor == null) {
            const style = window.getComputedStyle(main);
            userSolutionSolutionBackrgoundColor = style.getPropertyValue("background-color");
        } //if
        main.style.backgroundColor = userSolutionSolutionBackrgoundColor;
        main.title = elementSet.userSolution.title;
        elementSet.machineSolution.style.display = "none";
        elementSet.userSolution.style.display = "block";
        if (callback)
            callback();
        showingUserSolution = true;
    }; //elementSet.showUserSolution
    elementSet.showMachineSolution = callback => {
        if (machineSolutionBackrgoundColor == null) {
            const style = window.getComputedStyle(elementSet.machineSolution);
            machineSolutionBackrgoundColor = style.getPropertyValue("background-color");
            elementSet.machineSolution.style.backgroundColor = "transparent";
        } //if
        main.style.backgroundColor = machineSolutionBackrgoundColor;
        main.title = elementSet.machineSolution.title;
        main.title = "Machine solution";
        elementSet.userSolution.style.display = "none";
        elementSet.machineSolution.style.display = "block";
        if (callback)
            callback();
        showingUserSolution = false;
    }; //elementSet.showMachineSolution

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

    return elementSet;
};
