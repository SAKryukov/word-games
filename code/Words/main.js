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

    const sortedWordList = createSortedWordList(elementSet.main, elementSet.highlightClass);

    const languageSelector =
        createLanguageSelector(elementSet.input.languageSet, elementSet.input.options);
    elementSet.makeEqualHeight();
    
    const reset = () => {
        elementSet.input.inputSetWord.value = null;
        elementSet.input.inputTry.value = null; 
        elementSet.hideInputTry();
        sortedWordList.reset();
        elementSet.textShuffle.textContent = null;
        elementSet.count.textContent = 0;
    }; //reset

    elementSet.input.inputSetWord.onkeypress = event => {
        if (elementSet.isEnter(event) && event.target.value) {
            elementSet.showInputTry();
            if (!currentLanguage.alphabetical[event.target.value.toLowerCase()])
                modalPopup.show(gameDefinitionSet.setWordBad(currentLanguage, event.target.value));
        } else
            languageSelector.filterOut(event);
    }; //elementSet.input.inputSetWord.onkeypress

    elementSet.input.inputTry.onkeypress = event => {
        if (elementSet.isEnter(event) && event.target.value) {
            const trialWord = event.target.value.toLowerCase();
            let goodSubset = false;
            let inDictionary = false;
            if (currentLanguage.alphabetical[trialWord])
                inDictionary = true;
            if (dictionaryUtility.isSubset(trialWord, elementSet.input.inputSetWord.value.toLowerCase()))
                goodSubset = true;
            if (goodSubset && inDictionary) {
                if (!sortedWordList.add(trialWord))
                    modalPopup.show(gameDefinitionSet.alreadyFound(currentLanguage, trialWord));
                event.target.value = null;
                elementSet.count.textContent = sortedWordList.count();
            } //if
            if (!goodSubset && !inDictionary)
                modalPopup.show(gameDefinitionSet.trialWordDoubleBad(currentLanguage, trialWord)); 
            else {
                if (!goodSubset)
                    modalPopup.show(gameDefinitionSet.insufficientRepertoire(currentLanguage, trialWord));
                if (!inDictionary)
                    modalPopup.show(gameDefinitionSet.trialWordNotInDictionary(currentLanguage, trialWord));    
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
        setLanguageAndOptions();
        sortedWordList.reset();
        const setWord = elementSet.input.inputSetWord.value.toLowerCase();
        for (let word in currentLanguage.alphabetical) {            
            if (dictionaryUtility.isSubset(word, setWord))
                sortedWordList.add(word);
        } //loop
        elementSet.count.textContent = sortedWordList.count();
    }; //reviewMachineSolution
    
    (() => { // contextMenu:
        const gameIO = createGameIO(gameDefinitionSet, sortedWordList, elementSet, languageSelector);
        const contextMenu = new menuGenerator(elementSet.input.menu);
        contextMenu.subscribe(elementSet.menuItem.reviewMachineSolution, actionRequest => {
            if (!actionRequest) return true; 
            reviewMachineSolution();
        });
        const menuItemProxyApiSave = contextMenu.subscribe(elementSet.menuItem.saveGame, actionRequest => {
            if (!actionRequest) return gameIO != undefined && sortedWordList.count() > 0;
            gameIO.saveGame(currentLanguage);
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
        elementSet.product.copyrightYears.textContent = definitionSet.copirightYears;
    })(); //product

    elementSet.input.inputSetWord.focus();

}; //window.onload
