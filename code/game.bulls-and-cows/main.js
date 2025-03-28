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
    const tableInput = createTableInput();
    elementSet.main.appendChild(tableInput.tableElement);

    const languageSelector =
        createLanguageSelector(elementSet.input.languageSet, elementSet.input.options, () => {
        // on language change
        //SA???
    });
    const gameAlgorithm = getGameAlgorithm(languageSelector);

    const newRowHandler = () => {
        const row = tableInput.height - 1;
        for (let x = tableInput.width - 2; x <= tableInput.width - 1; ++x) {
            tableInput.enableCell(x, row, false);
            tableInput.setReadonly(x, row, true);
        } //loop
        tableInput.putCharacter(tableInput.width - 2, row, gameDefinitionSet.images.total);
        tableInput.putCharacter(tableInput.width - 1, row, gameDefinitionSet.images.bull);
    } //newRowHandler

    let secretWord = null;

    const gameReset = starting => {
        const wordLength =
            gameDefinitionSet.input.wordLength.valueFromIndex(
                elementSet.input.wordLength.selectedIndex);
        tableInput.reset(wordLength + 2, 1);
        newRowHandler();
        if (tableInput.height > 0 && tableInput.width > 0)
            tableInput.select(0, 0);
        tableInput.focus();
        if (starting) {
            elementSet.message = gameDefinitionSet.input.messages.promptEnterTrialWordInitial;
            secretWord = gameAlgorithm.pickRandomWord(wordLength);
        } else
            secretWord = null;
    } //gameReset
    gameReset();
    elementSet.input.wordLength.onchange = () => gameReset();
    for (let index = 0; index < gameDefinitionSet.sample.length; ++index)
        tableInput.putCharacter(index, 0, gameDefinitionSet.sample[index]);    

    tableInput.characterInputCallback = (cell, event) => {
        if (languageSelector.filterOut(event)) {
            cell.textContent = event.key.toUpperCase();
            return true;
        } //if
    }; //tableInput.characterInputCallback
    tableInput.enterCallback = (_, x, y) => {
        if (elementSet.isButtonStartReady)
            return;
        const row = tableInput.height - 1;
        if (!tableInput.isRowFilledIn(row)) {
            elementSet.message = gameDefinitionSet.input.messages.notFilledRow;
            return;
        } else
            elementSet.message = gameDefinitionSet.input.messages.promptEnterTrialWord;
        let guessWord = gameDefinitionSet.empty;
        for (let index = 0; index < tableInput.width - 2; ++index)
            guessWord += tableInput.getCharacter(index, row);
        const evaluation = gameAlgorithm.evaluateSolution(secretWord, guessWord, false);
        if (!gameAlgorithm.isInDictionary(guessWord)) {
            elementSet.message = 
                gameDefinitionSet.input.messages.badWord(guessWord,
                    languageSelector.currentLanguage.characterRepertoire.quotes);
            return;
        } //if
        tableInput.putCharacter(tableInput.width - 2, row, evaluation.total);
        tableInput.putCharacter(tableInput.width - 1, row, evaluation.bulls);
        if (evaluation.bulls == secretWord.length) {
            elementSet.input.onButtonStartStopToggle();
            elementSet.message = gameDefinitionSet.input.messages.congratulations;
            tableInput.setReadonlyRow(row, 0, tableInput.width - 2, true);
            return;
        } //if
        tableInput.addRow();
        newRowHandler();
        tableInput.select(0, row + 1);
        tableInput.setReadonlyRow(row, 0, tableInput.width - 2, true);
    } //tableInput.enterCallback

    elementSet.input.buttonStartStop.onclick = () => {
        if (elementSet.isButtonStartReady)
            gameReset(true);
        else
            elementSet.message = null;
        elementSet.input.onButtonStartStopToggle();
    } //elementSet.input.buttonStartStop.onclick

    (() => { //menu:
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
        });
        contextMenu.subscribe(elementSet.menuItem.revealSolution, actionRequest => {
            if (!actionRequest) return secretWord != null;
            modalPopup.show(secretWord.toUpperCase(), null, { textAlign: "center" }); 
        });
        //elementSet.isButtonStartReady
        setupMenuActivator(contextMenu, elementSet.input.buttonActivateMenu);
    })(); //menu

}; //window.onload
