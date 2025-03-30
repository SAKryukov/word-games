/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

window.onload = () => {

    const elementSet = getElementSet();
    const gameDefinitionSet = getDefinitionSet();
    elementSet.makeEqualWidth(elementSet.buttonShuffle);

    const sortedWordListUser = createSortedWordList(
        elementSet.userSolution, elementSet.highlightClass,
        wordCount => elementSet.count.textContent = wordCount);

    const sortedWordListMachine = createSortedWordList(
        elementSet.machineSolution, elementSet.highlightClass,
        wordCount => elementSet.count.textContent = wordCount);
    
    const languageSelector =
        createLanguageSelector(elementSet.input.languageSet, elementSet.input.options, () => {
            // on language change:
            elementSet.input.inputSetWord.value = null;
            elementSet.input.inputTry.value = null; 
            elementSet.hideInputTry();
            sortedWordListUser.reset();
            elementSet.textShuffle.textContent = null;
            elementSet.count.textContent = 0;    
        });
    const gameAlgorithm = getGameAlgorithm(languageSelector);
    
    elementSet.input.inputSetWord.onkeypress = event => {
        if (elementSet.isEnter(event) && event.target.value) {
            elementSet.showInputTry();
            if (!gameAlgorithm.isInDictionary(event.target.value.toLowerCase()))
                modalPopup.show(
                    gameDefinitionSet.setWordBad(languageSelector.currentLanguage, event.target.value),
                    null,
                    gameDefinitionSet.WarningFormat.modalPopupOptions);
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
                    modalPopup.show(gameDefinitionSet.alreadyFound(languageSelector.currentLanguage, trialWord));
                else
                    event.target.value = null;
            } //if
            if (!goodSubset && !inDictionary)
                modalPopup.show(gameDefinitionSet.trialWordDoubleBad(languageSelector.currentLanguage, trialWord)); 
            else {
                if (!goodSubset)
                    modalPopup.show(gameDefinitionSet.insufficientRepertoire(languageSelector.currentLanguage, trialWord));
                if (!inDictionary)
                    modalPopup.show(gameDefinitionSet.trialWordNotInDictionary(languageSelector.currentLanguage, trialWord));    
            } //if
        } else
            languageSelector.filterOut(event);
    }; //elementSet.input.inputTry.onkeypress

    elementSet.input.inputTry.oninput = () => elementSet.showUserSolution(() => sortedWordListUser.refresh());
    (() => { // setup shuffle:
        elementSet.input.inputSetWord.oninput = event => {
            sortedWordListUser.reset();
            shuffle(true);
            elementSet.showUserSolution(() => sortedWordListUser.refresh());
            elementSet.characterCount.textContent = event.target.value.length;
        };
        const shuffle = firstTime =>
            elementSet.textShuffle.textContent =
                gameAlgorithm.shuffleWord(elementSet.input.inputSetWord.value.toUpperCase(), firstTime);
        shuffle();
        elementSet.buttonShuffle.onclick = () => shuffle(false);
        window.onkeydown = event => {
            if (event.altKey) {
                if (event.key == elementSet.keyShuffle)
                    shuffle(false);
                if (event.key == elementSet.keyShuffleReset)
                    shuffle(true);
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
            modalPopup.show(gameDefinitionSet.machineSolution.countFormat(count));
}; //reviewMachineSolution
    
    (() => { // contextMenu:
        const dictionaryMaintenanceStarter = createDictionaryMaintenanceStarter(gameDefinitionSet);
        const gameIO = createGameIO(sortedWordListUser, elementSet, languageSelector, gameDefinitionSet);
        const restoreFocus = () => {
            elementSet.input.inputSetWord.focus();
            elementSet.input.inputTry.focus();
        }; //restoreFocus
        dictionaryMaintenanceStarter.prepareMenu(elementSet.input.menu);
        const contextMenu = new menuGenerator(elementSet.input.menu);
        dictionaryMaintenanceStarter.subsribe(contextMenu);
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
            menuItemProxyApiSave.changeText(gameDefinitionSet.invalidOperation(elementSet.menuItem.saveGameInExistingFile));
            menuItemProxyApiSaveAs.changeText(gameDefinitionSet.invalidOperation(elementSet.menuItem.saveGame));
            menuItemProxyApiLoad.changeText(gameDefinitionSet.invalidOperation(elementSet.menuItem.loadGame));
        } //if
        setupMenuActivator(contextMenu, elementSet.input.buttonActivateMenu);
    })(); //contextMenu

    (() => { // product:
        elementSet.product.title.textContent = definitionSet.title;
        elementSet.product.version.innerHTML = definitionSet.version;
        elementSet.product.copyrightYears.textContent = definitionSet.copyrightYears;
    })(); //product

    elementSet.input.inputSetWord.focus();

}; //window.onload
