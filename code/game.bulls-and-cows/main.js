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
        for (let x = tableInput.width - 2; x <= tableInput.width - 1; ++x)
            tableInput.enableCell(x, tableInput.height - 1, false);
    } //newRowHandler

    const gameReset = () => {
        const wordLength =
            gameDefinitionSet.input.wordLength.valueFromIndex(
                elementSet.input.wordLength.selectedIndex);
        tableInput.reset(wordLength + 2, 1, newRowHandler);
        if (tableInput.height > 0 && tableInput.width > 0)
            tableInput.select(0, 0);
    } //gameReset
    gameReset();
    elementSet.input.wordLength.onchange = () => gameReset();
    
    //const languageSelector =
    createLanguageSelector(elementSet.input.languageSet, elementSet.input.options, () => {
        // on language change:
        //SA???
    });

    tableInput.enterCallback = () => {
        tableInput.addRow();
        newRowHandler();
    } //tableInput.enterCallback

    tableInput.putCharacter(1, 0, "A");
    tableInput.putCharacter(2, 0, "B");
    tableInput.putCharacter(4, 0, 3);
    tableInput.putCharacter(5, 0, 2);
    tableInput.addRow();
    tableInput.enableCell(4, 1, false);
    tableInput.enableCell(5, 1, false);
    tableInput.putCharacter(4, 1, 1);
    tableInput.putCharacter(5, 1, 0);
    tableInput.insertCell(2); tableInput.select(2, 0);

}; //window.onload
