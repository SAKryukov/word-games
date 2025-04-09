/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

window.onload = () => {

    const tooltip =
        createTooltip(game.definitionSet.tooltip.elementTag, game.definitionSet.tooltip.cssClass);

    const elementSet = getElementSet(game.definitionSet);
    const tableInput = createTableInput(null, elementSet.main, 1, 1, false);
    elementSet.main.appendChild(tableInput.tableElement);

    tableInput.selectingCallback = (x, y) => {
        if (!tableInput.isCurrentCellReadonly)
            tableInput.putCharacter(x, y, null);
    }; //selectingCallback

    const languageSelector =
        createLanguageSelector(elementSet.input.languageSet, elementSet.input.options, tooltip, () => {
    });
    const gameAlgorithm = getGameAlgorithm(languageSelector);

    const newTurnHandler = () => {
        tableInput.insertCell();
        tableInput.insertCell(0);
    } //newTurnHandler

    const showInputPrompt = () => {
        elementSet.message = tableInput.width == 1
            ? game.definitionSet.input.messages.promptEnterCharacterFirst
            : game.definitionSet.input.messages.promptEnterCharacter;
    } //showInputPrompt;

    const gameReset = () => {
        elementSet.score.textContent = 0;
        const wordLength =
            game.definitionSet.input.wordLength.valueFromIndex(
                elementSet.input.wordLength.selectedIndex);
        if (wordLength) {
            let word = gameAlgorithm.pickLongerRandomWord(wordLength + 2).toUpperCase();
            word = gameAlgorithm.getRandomSubstring(word, wordLength);
            tableInput.text = [word];
            tableInput.setReadonlyRow(0, 0, tableInput.width, true);
            newTurnHandler();
        } else
            tableInput.reset(1, 1);
        if (tableInput.height > 0 && tableInput.width > 0)
            tableInput.select(tableInput.width - 1, 0);
        tableInput.focus();
        showInputPrompt();
    } //gameReset
    tableInput.reset(game.definitionSet.welcome.length, 1);
    tableInput.text = [game.definitionSet.welcome.toLocaleUpperCase()];
    tableInput.setReadonlyRow(0, 0, game.definitionSet.welcome.length, true);
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
        const wordLength =
            game.definitionSet.input.wordLength.valueFromIndex(
                elementSet.input.wordLength.selectedIndex);
        tableInput.setReadonly(tableInput.x, tableInput.y, true);
        const isAtBeginning = tableInput.x == 0;
        if (game.definitionSet.input.wordLength.valueFromIndex(
            elementSet.input.wordLength.selectedIndex) == 0 && tableInput.width == 1) {
                tableInput.insertCell(0);
                tableInput.insertCell();
                tableInput.select(tableInput.width - 1, 0);
            } else {
                if (isAtBeginning)
                    tableInput.insertCell(0);
                else
                    tableInput.insertCell();       
                tableInput.select(isAtBeginning ? 0 : tableInput.width - 1, 0);
            } //if
        const word = tableInput.text[0].slice(1, -1);
        showInputPrompt();
        if (wordLength > 0)
            elementSet.score.textContent
                = game.definitionSet.input.messages.relativeScore(
                    tableInput.width - 2 - wordLength,
                    tableInput.width - 2);
        else
            elementSet.score.textContent = tableInput.width - 2;
        if (!gameAlgorithm.isInDictionary(word)) return;
        elementSet.message = game.definitionSet.input.messages.congratulations(
            word,
            languageSelector.currentLanguage.characterRepertoire.quotes);
        tableInput.setReadonlyRow(0, 0, tableInput.width, true);
        elementSet.input.onButtonStartStopToggle();
        setTimeout(() => elementSet.input.buttonStartStop.focus());
    } //tableInput.enterCallback

    elementSet.input.buttonStartStop.onclick = () => {
        if (elementSet.isButtonStartReady)
            gameReset();
        else
            elementSet.message = null;
        elementSet.input.onButtonStartStopToggle();
    } //elementSet.input.buttonStartStop.onclick

    (() => { //menu:
        const gameIO = createGameIO(game.definitionSet, languageSelector,
            gameData => { //onSave:
                gameData.currentContent = tableInput.text[0].slice(1, -1);
            }, //onSave
            gameData => { //onLoad:
                tableInput.text = [gameData.currentContent];
                if (elementSet.isButtonStartReady)
                    elementSet.input.onButtonStartStopToggle();
                tableInput.setReadonlyRow(0, 0, tableInput.width, true);
                newTurnHandler();
                tableInput.select(tableInput.width - 1, 0);
                tableInput.focus();
            }, //onLoad
        );
        const contextMenu = new menuGenerator(elementSet.input.menu);
        contextMenu.subscribe(elementSet.menuItem.startGame, actionRequest => {
            if (!actionRequest) return elementSet.isButtonStartReady;
            elementSet.input.onButtonStartStopToggle();
                gameReset();    
        });
        contextMenu.subscribe(elementSet.menuItem.giveUp, actionRequest => {
            if (!actionRequest) return !elementSet.isButtonStartReady;
            elementSet.input.onButtonStartStopToggle();
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
