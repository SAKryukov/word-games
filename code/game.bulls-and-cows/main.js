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

    const newRowHandler = () => {
        const row = tableInput.height - 1;
        for (let x = tableInput.width - 2; x <= tableInput.width - 1; ++x) {
            tableInput.enableCell(x, row, false);
            tableInput.setReadonly(x, row, true);
        } //loop
        tableInput.putCharacter(tableInput.width - 2, row, "🏡");
        tableInput.putCharacter(tableInput.width - 1, row, "🐮");
    } //newRowHandler

    const gameReset = () => {
        const wordLength =
            gameDefinitionSet.input.wordLength.valueFromIndex(
                elementSet.input.wordLength.selectedIndex);
        tableInput.reset(wordLength + 2, 1);
        newRowHandler();
        if (tableInput.height > 0 && tableInput.width > 0)
            tableInput.select(0, 0);
        } //gameReset
    gameReset();
    elementSet.input.wordLength.onchange = () => gameReset();
    tableInput.putCharacter(0, 0, "T");
    tableInput.putCharacter(1, 0, "R");
    tableInput.putCharacter(2, 0, "Y");

    const languageSelector =
        createLanguageSelector(elementSet.input.languageSet, elementSet.input.options, () => {
        // on language change
        //SA???
    });
    const gameAlgorythm = getGameAlgorythm(languageSelector);

    tableInput.characterInputCallback = (cell, event) => {
        if (languageSelector.filterOut(event))
            cell.textContent = event.key.toUpperCase();
    }; //tableInput.characterInputCallback
    tableInput.enterCallback = (_, x, y) => {
        if (elementSet.isButtonStartReady)
            return;
        const row = tableInput.height - 1;
        if (!tableInput.isRowFilledIn(row)) {
            elementSet.message = "Fill in <b><i>all</i></b> the cells in the last row and press Enter";
            return;
        } else
            elementSet.message = "Enter the trial word";
        let guessWord = "";
        for (let index = 0; index < tableInput.width - 2; ++index)
            guessWord += tableInput.getCharacter(index, row);
        if (!gameAlgorythm.isInDictionary(guessWord)) {
            elementSet.message = `The word &ldquo;${guessWord}&rdquo; is not in dictionary`;
            return;
        } //if
        tableInput.addRow();
        newRowHandler();
        tableInput.select(0, row + 1);
        for (let index = 0; index < tableInput.width - 2; ++index)
            tableInput.setReadonly(index, row, true);
        tableInput.putCharacter(tableInput.width - 2, row, 2);
        tableInput.putCharacter(tableInput.width - 1, row, 1);
    } //tableInput.enterCallback

    elementSet.input.buttonStartStop.onclick = readyToStart => {
        elementSet.input.onButtonStartStopToggle();
        if (readyToStart) {
            gameReset();
            tableInput.focus();
            elementSet.message = "Enter the characters. In two last cells, you will see the sum of bulls+cows, and the number of <i>bulls</i>."
        } else
            elementSet.message = null;
    } //elementSet.input.buttonStartStop.onclick

}; //window.onload
