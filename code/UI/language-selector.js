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
    languageSelector.currentLanguage = null;
    let acceptBlankspaceCharacters = false;
    let acceptPunctuationCharacters = false;

    const setRepertoire = () => {
        repertoire = languageSelector.currentLanguage.characterRepertoire.letters;
        repertoire += repertoire.toUpperCase();
        if (acceptBlankspaceCharacters)
            repertoire += languageSelector.currentLanguage.characterRepertoire.blankSpace;
        if (acceptPunctuationCharacters)
            repertoire += languageSelector.currentLanguage.characterRepertoire.punctuation;        
    }; //setRepertoire

    languageSelector.filterOut = event => {
		if (event.charCode == 0) return true;
		var char = String.fromCharCode(event.charCode);
		if (repertoire.indexOf(char) >= 0) return true;
		if (event.preventDefault) event.preventDefault();
		return false;
    }; //filterOut

    (() => { // populate language set:
        let count = 0;
        let indexedDictionaries = [];
        for (let index in dictionaries) {
            const dictionary = dictionaries[index];
            indexedDictionaries.push(dictionary);
            if (!languageSelector.currentLanguage) {
                languageSelector.currentLanguage = dictionary;
            } //if
            const option = localDefinitionSet.createOption();
            option.value = dictionary.languageName;
            option.textContent = index;
            selectLanguageElement.appendChild(option);
            ++count;
        } //loop
        selectLanguageElement.size = count;
        languageSelector.currentLanguage = indexedDictionaries[selectLanguageElement.selectedIndex];
        selectLanguageElement.onchange = event => {
            languageSelector.currentLanguage = indexedDictionaries[event.target.selectedIndex];
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
        selectLanguageElement.selectedIndex = 0;
    } //if
    const chechedListBox = setupCheckedListBox(selectOptionsElement, [false, false],
        (index, _, value) => {
            if (index == 0)
                acceptBlankspaceCharacters = value;
            else
                acceptPunctuationCharacters = value;
            setRepertoire();
        });

    languageSelector.setOptionValues = (acceptBlankspaceCharactersValue, acceptPunctuationCharactersValue) => {
        chechedListBox.setValue(0, acceptBlankspaceCharactersValue);
        chechedListBox.setValue(1, acceptPunctuationCharactersValue);
    } //languageSelector.setOptionValues 
  
    return languageSelector;
};