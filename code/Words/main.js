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
    let currentLanguage = null;
    let repertoire = null;

    //const repertoireSelector = 
        createRepertoireSelector(gameDefinitionSet, elementSet.input.languageSet, elementSet.input.options);
    
    const setRepertoire = options => {
        const acceptBlankspaceCharacters = options[0];
        const acceptPunctuationCharacters = options[1];
        repertoire = currentLanguage.characterRepertoire.letters;
        repertoire += repertoire.toUpperCase();
        if (acceptBlankspaceCharacters)
            repertoire += currentLanguage.characterRepertoire.blankSpace;
        if (acceptPunctuationCharacters)
            repertoire += currentLanguage.characterRepertoire.punctuation;        
    }; //setRepertoire

    const optionsObject = (() => {
        const optionsObject = setupCheckedListBox(elementSet.input.options, [false, false]);
        optionsObject.setCallback(options => setRepertoire(options));
        return optionsObject;
    })();

    const filterOut = event => {
		if (event.charCode == 0) return true;
		var char = String.fromCharCode(event.charCode);
		if (repertoire.indexOf(char) >= 0) return true;
		if (event.preventDefault) event.preventDefault();
		return false;
    }; //filterOut

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
            filterOut(event);
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
            filterOut(event);
    }; //elementSet.input.inputTry.onkeypress

    const setLanguageAndOptions = () => {
        const languageName = elementSet.input.languageSet.children[elementSet.input.languageSet.selectedIndex].value
        for (let index in dictionaries) {
            if (languageName == dictionaries[index].languageName) {
                currentLanguage = dictionaries[index];
                break;
            } //if
        } //loop
        setRepertoire(optionsObject.getValues());
    }; //setupLanguageAndOptions
    elementSet.input.inputSetWord.onfocus = () => setLanguageAndOptions();
    elementSet.input.inputTry.onfocus = () => setLanguageAndOptions();    

    (() => { // populate language set:
        let count = 0;
        let indexedDictionaries = [];
        for (let index in dictionaries) {
            const dictionary = dictionaries[index];
            indexedDictionaries.push(dictionary);
            if (!currentLanguage) {
                currentLanguage = dictionary;
                setRepertoire(optionsObject.getValues());
            } //if
            const option = elementSet.createOption();
            option.value = dictionary.languageName;
            option.textContent = index;
            elementSet.input.languageSet.appendChild(option);
            ++count;
        } //loop
        elementSet.makeEqualHeight();
        elementSet.input.languageSet.size = count;
        elementSet.input.languageSet.onchange = event => {
            currentLanguage = indexedDictionaries[event.target.selectedIndex];
            setRepertoire(optionsObject.getValues());
            reset();
        };
    })(); //populate language set

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
        const gameIO = createGameIO(gameDefinitionSet, sortedWordList, elementSet, optionsObject);
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
