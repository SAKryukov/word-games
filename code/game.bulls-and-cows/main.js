/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

window.onload = () => {

    const tooltip = (() => {
        const tooltip = createTooltip(games.definitionSet.tooltip.elementTag);
        tooltip.cssClass = games.definitionSet.tooltip.cssClass;
        tooltip.showTime = games.definitionSet.tooltip.showTime;
        tooltip.isPriorityVertical = games.definitionSet.tooltip.isPriorityVertical;
        tooltip.priorityDataSetName = games.definitionSet.tooltip.priorityDataSetName;    
        return tooltip;
    })();

    const elementSet = getElementSet(game.definitionSet);
    const tableInput = createTableInput(null, elementSet.main, null, null, true, game.definitionSet.emptyCell);
    elementSet.main.appendChild(tableInput.tableElement);

    const languageSelector =
        createLanguageSelector(elementSet.input.languageSet, elementSet.input.options);
    languageSelector.tooltip = tooltip;

    const gameAlgorithm = getGameAlgorithm(languageSelector);

    const newRowHandler = () => {
        const row = tableInput.height - 1;
        for (let x = tableInput.width - 2; x <= tableInput.width - 1; ++x) {
            tableInput.enableCell(x, row, false);
            tableInput.setReadonly(x, row, true);
        } //loop
        tableInput.putCharacter(tableInput.width - 2, row, game.definitionSet.images.total);
        tableInput.putCharacter(tableInput.width - 1, row, game.definitionSet.images.bull);
    } //newRowHandler

    let secretWord = null;

    const gameReset = starting => {
        elementSet.score.textContent = 0;
        const wordLength =
            game.definitionSet.input.wordLength.valueFromIndex(
                elementSet.input.wordLength.selectedIndex);
        tableInput.reset(wordLength + 2, 1);
        newRowHandler();
        if (tableInput.height > 0 && tableInput.width > 0)
            tableInput.select(0, 0);
        tableInput.focus();
        if (starting) {
            elementSet.message = game.definitionSet.input.messages.promptEnterTrialWordInitial;
            secretWord = gameAlgorithm.pickRandomWord(wordLength);
        } else
            secretWord = null;
    } //gameReset
    gameReset();
    for (let index = 0; index < game.definitionSet.sample.length; ++index)
        tableInput.putCharacter(index, 0, game.definitionSet.sample[index]);    

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
            elementSet.message = game.definitionSet.input.messages.notFilledRow;
            return;
        } else
            elementSet.message = game.definitionSet.input.messages.promptEnterTrialWord;
        let guessWord = game.definitionSet.empty;
        for (let index = 0; index < tableInput.width - 2; ++index)
            guessWord += tableInput.getCharacter(index, row);
        const evaluation = gameAlgorithm.evaluateBullsAndCowsSolution(secretWord, guessWord);
        if (languageSelector.currentLanguage.characterRepertoire.letters.length > 0 && !gameAlgorithm.isInDictionary(guessWord)) {
            elementSet.message = 
                game.definitionSet.input.messages.badWord(guessWord,
                    languageSelector.currentLanguage.characterRepertoire.quotes);
            return;
        } //if
        tableInput.putCharacter(tableInput.width - 2, row, evaluation.total);
        tableInput.putCharacter(tableInput.width - 1, row, evaluation.bulls);
        if (evaluation.bulls == secretWord.length) {
            elementSet.input.onButtonStartStopToggle();
            elementSet.message = game.definitionSet.input.messages.congratulations;
            tableInput.setReadonlyRow(row, 0, tableInput.width - 2, true);
            return;
        } //if
        elementSet.score.textContent = tableInput.height;
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
        const gameIO = createGameIO(game.definitionSet, languageSelector,
            gameData => { //onSave:
                gameData.secretWord = gameIO.restoreGame.obfuscate(secretWord);
                gameData.moves = tableInput.text;
                const last = gameData.moves.length - 1;
                gameData.moves[last] = gameData.moves[last].substr(0, tableInput.width - 2);
                gameData.selection = [tableInput.x, tableInput.y];
            }, //onSave
            gameData => { //onLoad:
                secretWord = gameIO.restoreGame.deobfuscate(gameData.secretWord);
                const moves = gameData.moves;
                let lastWord = moves[moves.length - 1];
                lastWord = lastWord.slice(0, lastWord.length - 4);
                moves[moves.length - 1] = lastWord;
                tableInput.text = gameData.moves;
                for (let row = 0; row < tableInput.height - 1; ++row)
                    for (let column = 0; column < tableInput.width; ++column) {
                        tableInput.setReadonly(column, row, true);
                        if (column > tableInput.width - 3)
                            tableInput.enableCell(column, row, false);
                    } //loop
                newRowHandler();
                tableInput.select(gameData.selection[0], gameData.selection[1]);
                elementSet.input.wordLength.selectedIndex =
                    game.definitionSet.input.wordLength.indexFromValue(tableInput.width - 2);
                if (elementSet.isButtonStartReady) {
                    elementSet.input.onButtonStartStopToggle();
                } //if
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
        contextMenu.subscribe(elementSet.menuItem.revealSolution, actionRequest => {
            if (!actionRequest) return secretWord != null;
            modalPopup.show(
                secretWord.toUpperCase(),
                [{
                    text: game.definitionSet.revealSecretWordPopup.buttonText,
                    default: true, escape: true,
                    action: () => tableInput.focus()
                }],
                { textAlign: game.definitionSet.revealSecretWordPopup.textAlign },
                () => tableInput.focus()); 
        });
        //elementSet.isButtonStartReady
        setupMenuActivator(contextMenu, elementSet.input.buttonActivateMenu);
    })(); //menu

}; //window.onload
