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

    tableInput.selectingCallback = (x, y) => {
        if (!tableInput.isCurrentCellReadonly)
            tableInput.putCharacter(x, y, null);
    }; //selectingCallback

    const languageSelector =
        createLanguageSelector(elementSet.input.languageSet, elementSet.input.options, () => {
    });
    const gameAlgorithm = getGameAlgorithm(languageSelector);

    const newTurnHandler = () => {
        tableInput.insertCell();
        tableInput.insertCell(0);
    } //newTurnHandler

    const gameReset = starting => {
        if (!starting) {
            tableInput.reset(gameDefinitionSet.welcome.length, 1);
            tableInput.text = [gameDefinitionSet.welcome.toLocaleUpperCase()];
            tableInput.setReadonlyRow(0, 0, gameDefinitionSet.welcome.length, true);
            elementSet.input.buttonStartStop.focus();
            return;
        } //if
        const wordLength =
            gameDefinitionSet.input.wordLength.valueFromIndex(
                elementSet.input.wordLength.selectedIndex);
        if (wordLength) {
            let word = gameAlgorithm.pickLongerRandomWord(wordLength + 2).toUpperCase();
            word = gameAlgorithm.getRandomSubstring(word, wordLength);
            tableInput.text = [word];
            tableInput.setReadonlyRow(0, 0, tableInput.width, true);
        } else
            tableInput.reset(0, 1);
        newTurnHandler();
        if (tableInput.height > 0 && tableInput.width > 0)
            tableInput.select(tableInput.width - 1, 0);
        tableInput.focus();
        if (starting)
            elementSet.message = gameDefinitionSet.input.messages.promptEnterTrialWord;
    } //gameReset
    gameReset();
    elementSet.input.buttonStartStop.focus();

    tableInput.characterInputCallback = (cell, event) => {
        if (languageSelector.filterOut(event)) {
            cell.textContent = event.key.toUpperCase();
            return true;
        } //if
    }; //tableInput.characterInputCallback
    tableInput.enterCallback = (_, x, y) => {
        if (tableInput.isCurrentCellReadonly) return;
        if (!gameAlgorithm.isValidCharacter(tableInput.getCharacter(tableInput.x, tableInput.y))) return;
        tableInput.setReadonly(tableInput.x, tableInput.y, true);
        const isAtBeginning = tableInput.x == 0;
        if (isAtBeginning)
            tableInput.insertCell(0);
        else
            tableInput.insertCell();
        tableInput.select(isAtBeginning ? 0 : tableInput.width - 1, 0);
        const word = tableInput.text[0].slice(1, -1);
        if (!gameAlgorithm.isInDictionary(word)) return;
        elementSet.message = gameDefinitionSet.input.messages.congratulations(
            word,
            languageSelector.currentLanguage.characterRepertoire.quotes);
        tableInput.setReadonlyRow(0, 0, tableInput.width, true);
        elementSet.input.onButtonStartStopToggle();
        setTimeout(() => elementSet.input.buttonStartStop.focus());
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
