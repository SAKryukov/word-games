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

    const sortedWordList = createSortedWordList(
        elementSet.main, elementSet.highlightClass,
        wordCount => elementSet.count.textContent = wordCount);

    const languageSelector =
        createLanguageSelector(elementSet.input.languageSet, elementSet.input.options, () => {
            // on language change:
            elementSet.input.inputSetWord.value = null;
            elementSet.input.inputTry.value = null; 
            elementSet.hideInputTry();
            sortedWordList.reset();
            elementSet.textShuffle.textContent = null;
            elementSet.count.textContent = 0;    
        });
    elementSet.makeEqualHeight();
    
    elementSet.input.inputSetWord.onkeypress = event => {
        if (elementSet.isEnter(event) && event.target.value) {
            elementSet.showInputTry();
            if (!languageSelector.currentLanguage.alphabetical[event.target.value.toLowerCase()])
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
            if (languageSelector.currentLanguage.alphabetical[trialWord])
                inDictionary = true;
            if (dictionaryUtility.isSubset(trialWord, elementSet.input.inputSetWord.value.toLowerCase()))
                goodSubset = true;
            if (goodSubset && inDictionary) {
                if (!sortedWordList.add(trialWord))
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

    (() => { // setup shuffle:
        elementSet.input.inputSetWord.oninput = event => {
            sortedWordList.reset();
            shuffle(true);
            elementSet.characterCount.textContent = event.target.value.length;
        };
        const shuffle = firstTime =>
            elementSet.textShuffle.textContent =
                dictionaryUtility.shuffleWord(elementSet.input.inputSetWord.value.toUpperCase(), firstTime);
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

    const reviewMachineSolution = () => {
        sortedWordList.reset();
        const setWord = elementSet.input.inputSetWord.value.toLowerCase();
        for (let word in languageSelector.currentLanguage.alphabetical) {            
            if (dictionaryUtility.isSubset(word, setWord))
                sortedWordList.add(word);
        } //loop
    }; //reviewMachineSolution
    
    (() => { // contextMenu:
        const dictionaryMaintenanceStarter = createDictionaryMaintenanceStarter(gameDefinitionSet);
        const gameIO = createGameIO(gameDefinitionSet, sortedWordList, elementSet, languageSelector);
        dictionaryMaintenanceStarter.prepareMenu(elementSet.input.menu);
        const contextMenu = new menuGenerator(elementSet.input.menu);
        dictionaryMaintenanceStarter.subsribe(contextMenu);
        contextMenu.subscribe(elementSet.menuItem.reviewMachineSolution, actionRequest => {
            if (!actionRequest) return true; 
            reviewMachineSolution();
        });        
        const menuItemProxyApiSave = contextMenu.subscribe(elementSet.menuItem.saveGame, actionRequest => {
            if (!actionRequest) return gameIO != undefined && !sortedWordList.isEmpty() > 0;
            gameIO.saveGame(languageSelector.currentLanguage);
        });
        if (!gameIO)
            menuItemProxyApiSave.changeText(gameDefinitionSet.invalidOperation(elementSet.menuItem.saveGame));
        const menuItemProxyApiLoad = contextMenu.subscribe(elementSet.menuItem.loadGame, actionRequest => {
            if (!actionRequest) return gameIO != undefined;
            gameIO.restoreGame();
        });
        if (!gameIO)
            menuItemProxyApiLoad.changeText(gameDefinitionSet.invalidOperation(elementSet.menuItem.loadGame));
        let lastPointerX = 0;
        let lastPointerY = 0;
        window.onpointermove = event => {
            lastPointerX = event.clientX;
            lastPointerY = event.clientY;
        }; 
        window.oncontextmenu = event => {
            const isPointer = event.button >= 0;
            if (isPointer)
                contextMenu.activate(event.clientX, event.clientY);
            else
                contextMenu.activate(lastPointerX, lastPointerY);
            event.preventDefault();
        }; //window.oncontextmenu
        elementSet.input.buttonActivateMenu.onclick = event => {
            const rectangle = event.target.getBoundingClientRect();
            contextMenu.activate((rectangle.left + rectangle.right) / 2, rectangle.bottom);
        }; 
    })(); //contextMenu

    (() => { // product:
        elementSet.product.title.textContent = definitionSet.title;
        elementSet.product.version.innerHTML = definitionSet.version;
        elementSet.product.copyrightYears.textContent = definitionSet.copyrightYears;
    })(); //product

    elementSet.input.inputSetWord.focus();

}; //window.onload
