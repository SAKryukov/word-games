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

    const elementSet = getElementSet();
    elementSet.makeEqualWidth(elementSet.buttonShuffle);

    const sortedWordListUser = createSortedWordList(
        elementSet.userSolution, elementSet.highlightClass,
        wordCount => elementSet.count.textContent = wordCount);

    const sortedWordListMachine = createSortedWordList(
        elementSet.machineSolution, elementSet.highlightClass,
        wordCount => elementSet.count.textContent = wordCount);
    
    const languageSelector = (() => {
        const languageSelector =
            createLanguageSelector(elementSet.input.languageSet, elementSet.input.options);
        languageSelector.tooltip = tooltip;
        languageSelector.onCharacterSetChange = () => {
            // on language change:
            elementSet.input.inputSetWord.value = null;
            elementSet.input.inputTry.value = null;
            elementSet.hideInputTry();
            sortedWordListUser.reset();
            elementSet.textShuffle.textContent = null;
            elementSet.textClassify.textContent = null;
            elementSet.count.textContent = 0;
        }; //languageSelector.onCharacterSetChange
        return languageSelector;
    })();

    const gameAlgorithm = getGameAlgorithm(languageSelector);
    
    elementSet.input.inputSetWord.onkeypress = event => {
        if (elementSet.isEnter(event) && event.target.value) {
            elementSet.showInputTry();
            if (!gameAlgorithm.isInDictionary(event.target.value.toLowerCase()))
                modalPopup.show(
                    game.definitionSet.setWordBad(languageSelector.currentLanguage, event.target.value),
                    null,
                    game.definitionSet.warningFormat.modalPopupOptions);
        } else
            languageSelector.filterOut(event);
    }; //elementSet.input.inputSetWord.onkeypress

    elementSet.input.inputTry.onkeypress = event => {
        if (elementSet.isEnter(event) && event.target.value) {
            const trialWord = event.target.value.toLowerCase();
            let goodSubset = false;
            let inDictionary = false;
            if (gameAlgorithm.isInDictionary(trialWord))
                inDictionary = true;
            if (gameAlgorithm.canBeComposedOf(trialWord, elementSet.input.inputSetWord.value.toLowerCase()))
                goodSubset = true;
            if (goodSubset && inDictionary) {
                if (!sortedWordListUser.add(trialWord))
                    modalPopup.show(game.definitionSet.alreadyFound(languageSelector.currentLanguage, trialWord));
                else
                    event.target.value = null;
            } //if
            if (!goodSubset && !inDictionary)
                modalPopup.show(game.definitionSet.trialWordDoubleBad(languageSelector.currentLanguage, trialWord)); 
            else {
                if (!goodSubset)
                    modalPopup.show(game.definitionSet.insufficientRepertoire(languageSelector.currentLanguage, trialWord));
                if (!inDictionary)
                    modalPopup.show(game.definitionSet.trialWordNotInDictionary(languageSelector.currentLanguage, trialWord));    
            } //if
        } else
            languageSelector.filterOut(event);
    }; //elementSet.input.inputTry.onkeypress

    elementSet.input.inputTry.oninput = () => elementSet.showUserSolution(() => sortedWordListUser.refresh());
    const gameIO = createGameIO(sortedWordListUser, elementSet, languageSelector, game.definitionSet, gameAlgorithm);
    (() => { // setup shuffle:
        elementSet.input.inputSetWord.oninput = event => {
            sortedWordListUser.reset();
            gameIO.shuffleAndClassify(true);
            elementSet.showUserSolution(() => sortedWordListUser.refresh());
            elementSet.characterCount.textContent = event.target.value.length;
        };
        gameIO.shuffleAndClassify(true);
        elementSet.buttonShuffle.onclick = () => gameIO.shuffleAndClassify(false);
        window.onkeydown = event => {
            if (event.altKey) {
                if (event.key == elementSet.keyShuffle)
                    gameIO.shuffleAndClassify(false);
                if (event.key == elementSet.keyShuffleReset)
                    gameIO.shuffleAndClassify(true);
                if (elementSet.isKeyShuffleRelated(event))
                    event.preventDefault();
            } //if
        };
    })(); //setup shuffle

    const reviewMachineSolution = showWords => {
        const setWord = elementSet.input.inputSetWord.value.toLowerCase();
        let count = 0;
        if (showWords)
            sortedWordListMachine.reset();
        for (let word of languageSelector.currentLanguage.alphabetical)
            if (gameAlgorithm.canBeComposedOf(word, setWord))
                if (showWords)
                    sortedWordListMachine.add(word);
                else
                    ++count;
        if (showWords && !sortedWordListMachine.isEmpty)
            elementSet.showMachineSolution(() => () => sortedWordListMachine.refresh());
        if (!showWords)
            modalPopup.show(game.definitionSet.machineSolution.countFormat(count));
        }; //reviewMachineSolution
    
    (() => { // contextMenu:
        const restoreFocus = () => {
            elementSet.input.inputSetWord.focus();
            elementSet.input.inputTry.focus();
        }; //restoreFocus
        const contextMenu = new menuGenerator(elementSet.input.menu);
        contextMenu.subscribe(elementSet.menuItem.viewMachineSolutionCount, actionRequest => {
            if (!actionRequest) return true; 
            reviewMachineSolution(false);
            restoreFocus();
        });        
        contextMenu.subscribe(elementSet.menuItem.reviewMachineSolution, actionRequest => {
            if (!actionRequest) return true; 
            reviewMachineSolution(true);
            restoreFocus();
        }); 
        contextMenu.subscribe(elementSet.menuItem.backToUserSolution, actionRequest => {
            if (!actionRequest) return !elementSet.isUserSolutionShown; 
            elementSet.showUserSolution(() => sortedWordListUser.refresh());
            restoreFocus();
        });
        const menuItemProxyApiSave = contextMenu.subscribe(elementSet.menuItem.saveGameInExistingFile, actionRequest => {
            if (!actionRequest)
                return gameIO != undefined && !sortedWordListUser.isEmpty;
            gameIO.saveGame(languageSelector.currentLanguage, true);
            restoreFocus();
        });
        const menuItemProxyApiSaveAs = contextMenu.subscribe(elementSet.menuItem.saveGame, actionRequest => {
            if (!actionRequest)
                return gameIO != undefined && !sortedWordListUser.isEmpty;
            gameIO.saveGame(languageSelector.currentLanguage, false);
            restoreFocus();
        });
        const menuItemProxyApiLoad = contextMenu.subscribe(elementSet.menuItem.loadGame, actionRequest => {
            if (!actionRequest) return gameIO != undefined;
            gameIO.restoreGame();
            restoreFocus();
        });
        if (!gameIO) {
            menuItemProxyApiSave.changeText(game.definitionSet.invalidOperation(elementSet.menuItem.saveGameInExistingFile));
            menuItemProxyApiSaveAs.changeText(game.definitionSet.invalidOperation(elementSet.menuItem.saveGame));
            menuItemProxyApiLoad.changeText(game.definitionSet.invalidOperation(elementSet.menuItem.loadGame));
        } //if
        setupMenuActivator(contextMenu, elementSet.input.buttonActivateMenu);
    })(); //contextMenu

    elementSet.input.inputSetWord.focus();

}; //window.onload
