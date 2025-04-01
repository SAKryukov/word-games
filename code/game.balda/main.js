/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

window.onload = () => {

    const gameDefinitionSet = getGameDefinitionSet();
    const elementSet = getElementSet(gameDefinitionSet);
    const tableInput = createTableInput(null, elementSet.main, 1, 1, false);
    elementSet.main.appendChild(tableInput.tableElement);

    const languageSelector =
        createLanguageSelector(elementSet.input.languageSet, elementSet.input.options, () => {
    });
    const gameAlgorithm = getGameAlgorithm(languageSelector);

    const newTurnHandler = () => {
    } //newTurnHandler

    const gameReset = starting => {
        const wordLength =
            gameDefinitionSet.input.wordLength.valueFromIndex(
                elementSet.input.wordLength.selectedIndex);
        if (wordLength) {
            let word = gameAlgorithm.pickLongerRandomWord(wordLength + 2).toUpperCase();
            word = gameAlgorithm.getRandomSubstring(word, wordLength);
            tableInput.text = [` ${word} `];
        } else {
            tableInput.reset(1, 1);
            tableInput.putCharacter(0, 0, gameAlgorithm.randomLetter.toUpperCase());
        } //if
        newTurnHandler();
        if (tableInput.height > 0 && tableInput.width > 0)
            tableInput.select(0, 0);
        tableInput.focus();
        if (starting) 
            elementSet.message = gameDefinitionSet.input.messages.promptEnterTrialWordInitial;
    } //gameReset
    gameReset();

    tableInput.characterInputCallback = (cell, event) => {
        if (languageSelector.filterOut(event)) {
            cell.textContent = event.key.toUpperCase();
            return true;
        } //if
    }; //tableInput.characterInputCallback
    tableInput.enterCallback = (_, x, y) => {
        newTurnHandler();
        tableInput.select(0, 0); //SA???
    } //tableInput.enterCallback

    elementSet.input.buttonStartStop.onclick = () => {
        if (elementSet.isButtonStartReady)
            gameReset(true);
        else
            elementSet.message = null;
        elementSet.input.onButtonStartStopToggle();
    } //elementSet.input.buttonStartStop.onclick

    (() => { //menu:
        const gameIO = createGameIO(gameDefinitionSet, languageSelector,
            gameData => { //onSave:
                gameData.currentContent = tableInput.text[0];
            }, //onSave
            gameData => { //onLoad:
                tableInput.text = [gameData.currentContent];
                tableInput.focus();
            }, //onLoad
        );
        const contextMenu = new menuGenerator(elementSet.input.menu);
        contextMenu.subscribe(elementSet.menuItem.startGame, actionRequest => {
            if (!actionRequest) return elementSet.isButtonStartReady;
            elementSet.input.onButtonStartStopToggle();
            gameReset(true);    
        });
        contextMenu.subscribe(elementSet.menuItem.giveUp, actionRequest => {
            if (!actionRequest) return !elementSet.isButtonStartReady;
            elementSet.input.onButtonStartStopToggle();
            gameReset(false);
            elementSet.message = null;
            elementSet.input.buttonStartStop.focus();
        });
        contextMenu.subscribe(elementSet.menuItem.saveGame, actionRequest => {
            if (!actionRequest) return gameIO != undefined && !elementSet.isButtonStartReady;
            gameIO.saveGame(languageSelector.currentLanguage, true);
            tableInput.focus();
        });
        contextMenu.subscribe(elementSet.menuItem.saveGameInExistingFile, actionRequest => {
            if (!actionRequest) return gameIO != undefined && !elementSet.isButtonStartReady;
            gameIO.saveGame(languageSelector.currentLanguage, false);
            tableInput.focus();
        });
        contextMenu.subscribe(elementSet.menuItem.loadGame, actionRequest => {
            if (!actionRequest) return gameIO != undefined;
            gameIO.restoreGame();
        });
        setupMenuActivator(contextMenu, elementSet.input.buttonActivateMenu);
    })(); //menu

}; //window.onload
