/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const createLanguageSelector = (selectLanguageElement, selectOptionsElement, onLanguagechange) => {
    const languageSelector = {};

    const localDefinitionSet = {
      characterRepertoireOptions: {
        acceptBlankspaceCharacters: "Accept blankspace characters",
        acceptPunctuationCharacters: "Accept punctuation characters",
      },
      createOption: () => document.createElement("option"),
    }; //localDefinitionSet

    let repertoire = null;
    let selectedLanguage = null;
    let acceptBlankspaceCharacters = false;
    let acceptPunctuationCharacters = false;

    Object.defineProperties(languageSelector, {
        acceptBlankspaceCharactersValue: {
            get() { return acceptBlankspaceCharacters; },
            enumerable: true, 
        },
        acceptPunctuationCharactersValue: {
            get() { return acceptPunctuationCharacters; },
            enumerable: true, 
        },
        currentLanguage: {
            get() { return selectedLanguage; },
            enumerable: true, 
        },
    }); //languageSelector.defineProperties options

    const setRepertoire = () => {
        repertoire = selectedLanguage.characterRepertoire.letters;
        repertoire += repertoire.toUpperCase();
        if (acceptBlankspaceCharacters)
            repertoire += selectedLanguage.characterRepertoire.blankSpace;
        if (acceptPunctuationCharacters)
            repertoire += selectedLanguage.characterRepertoire.punctuation;        
    }; //setRepertoire

    languageSelector.filterOut = event => {
		if (event.charCode == 0) return true;
		var char = String.fromCharCode(event.charCode);
		if (repertoire.indexOf(char) >= 0) return true;
		if (event.preventDefault) event.preventDefault();
		return false;
    }; //filterOut

    (() => { // populate language set:
        let indexedDictionaries = [];
        let count = 0;
        for (let index in dictionaries) {
            const dictionary = dictionaries[index];
            indexedDictionaries.push(dictionary);
            const option = localDefinitionSet.createOption();
            option.value = dictionary.languageName;
            option.textContent = index;
            selectLanguageElement.appendChild(option);
            ++count;
        } //loop
        selectLanguageElement.selectedIndex = 0;
        selectLanguageElement.size = count;
        selectedLanguage = indexedDictionaries[selectLanguageElement.selectedIndex];
        selectLanguageElement.onchange = event => {
            selectedLanguage = indexedDictionaries[event.target.selectedIndex];
            setRepertoire();
            if (onLanguagechange)
                onLanguagechange();
        };
        setRepertoire();
    })(); //populate language set

    if (selectOptionsElement) {
    let option = document.createElement("option");
        option.textContent = localDefinitionSet.characterRepertoireOptions.acceptBlankspaceCharacters;
        selectOptionsElement.appendChild(option);
        option = document.createElement("option");
        option.textContent = localDefinitionSet.characterRepertoireOptions.acceptPunctuationCharacters;
        selectOptionsElement.appendChild(option);
        document.createElement("option");
        selectOptionsElement.size = 2;
    } //if
    const checkedListBox = setupCheckedListBox(selectOptionsElement, [false, false],
        (index, _, value) => {
            if (index == 0)
                acceptBlankspaceCharacters = value;
            else
                acceptPunctuationCharacters = value;
            setRepertoire();
        });

    languageSelector.setOptionValues = (acceptBlankspaceCharactersValue, acceptPunctuationCharactersValue) => {
        checkedListBox.setValue(0, acceptBlankspaceCharactersValue);
        checkedListBox.setValue(1, acceptPunctuationCharactersValue);
    } //languageSelector.setOptionValues

    languageSelector.setLanguage = languageName => {
        selectedLanguage = dictionaries[languageName];
        let index = 0;
        for (let key in dictionaries) {
            if (key == languageName) break;
            ++index;
        } //loop
        selectLanguageElement.selectedIndex = index;
        setRepertoire();
    } //languageSelector.setLanguage

     (() => { //makeEqualHeight
        const height =  Math.max(selectOptionsElement.offsetHeight, selectLanguageElement.offsetHeight);
        const heightPx = `${height}px`;
        selectLanguageElement.style.height = heightPx;
        selectOptionsElement.style.height = heightPx;
    })(); //makeEqualHeight
    
    return languageSelector;
};