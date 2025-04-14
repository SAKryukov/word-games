/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const createLanguageSelector = (selectLanguageElement, selectOptionsElement) => {
    const languageSelector = {};

    const localDefinitionSet = {
      characterRepertoireOptions: {
        acceptBlankspaceCharacters: "Accept blankspace characters",
        acceptPunctuationCharacters: "Accept punctuation characters",
      },
      createOption: () => document.createElement("option"),
      displayRepertoire: repertoire => {
        let cells = "";
        let caseInsensitive = repertoire.toUpperCase() == repertoire.toLowerCase()
            ? ""
            : ", case-insensitive";
        for (let character of repertoire)
            cells += `<td>${character}</td>`;
        return `Valid input characters${caseInsensitive}:<br/>
                <table><tr>${cells}</tr></table>` },
      empty: "",
    }; //localDefinitionSet

    let repertoire = null;
    let selectedLanguage = null;
    let acceptBlankspaceCharacters = false;
    let acceptPunctuationCharacters = false;
    let onCharacterSetChange = null;
    let tooltip = null;

    Object.defineProperties(languageSelector, {
        acceptBlankspaceCharactersValue: {
            get() { return acceptBlankspaceCharacters; },
        },
        acceptPunctuationCharactersValue: {
            get() { return acceptPunctuationCharacters; },
        },
        currentLanguage: {
            get() { return selectedLanguage; },
        },
        repertoire: {
            get() { return repertoire; },
        },
        onCharacterSetChange: {
            set(value) { onCharacterSetChange = value; },
        },
        tooltip: {
            set(value) {
                tooltip = value;
                if (!tooltip) return;
                tooltip.onClickHandler = event => {
                    if (
                        event.target == selectLanguageElement
                        || event.target == selectOptionsElement
                        || (event.target.parentElement
                            && (event.target.parentElement == selectLanguageElement
                                || event.target.parentElement == selectOptionsElement)))
                        setRepertoire(event.target);
                }; //tooltip.onClickHandler
            },
        }
    }); //languageSelector.defineProperties options

    const setRepertoire = target => {
        let isDigits = selectedLanguage.characterRepertoire.letters.length == 0;
        repertoire = isDigits
            ? selectedLanguage.characterRepertoire.digits
            : selectedLanguage.characterRepertoire.letters;
            if (acceptBlankspaceCharacters)
                repertoire = selectedLanguage.characterRepertoire.blankSpace + repertoire;
            if (acceptPunctuationCharacters)
            repertoire += selectedLanguage.characterRepertoire.punctuation;        
        if (target != null && tooltip != null)
            tooltip.show(localDefinitionSet.displayRepertoire(repertoire), target);
    }; //setRepertoire

    languageSelector.filterOut = event => {
		const char = event.key;
        if (!char || char.length != 1) return false;
		if (repertoire.indexOf(char) >= 0 ||
            repertoire.indexOf(char.toUpperCase()) > 0)
                return true;
		if (event.preventDefault) event.preventDefault();
		return false;
    }; //filterOut

    (() => { // populate language set:
        let count = 0;
        for (let index in dictionaries.list) {
            const dictionary = dictionaries.list[index];
            const option = localDefinitionSet.createOption();
            option.value = dictionary.languageName;
            option.textContent = dictionary.languageName;
            selectLanguageElement.appendChild(option);
            ++count;
        } //loop
        selectLanguageElement.selectedIndex = 0;
        if (!selectLanguageElement.size)
            selectLanguageElement.size = count;
        selectedLanguage = dictionaries.list[selectLanguageElement.selectedIndex];
        selectLanguageElement.onchange = event => {
            selectedLanguage = dictionaries.list[event.target.selectedIndex];
            setRepertoire(event.target);
            if (onCharacterSetChange)
                onCharacterSetChange();
        };
        setRepertoire();
    })(); //populate language set

    if (selectOptionsElement) {
        let option = localDefinitionSet.createOption();
        option.textContent = localDefinitionSet.characterRepertoireOptions.acceptBlankspaceCharacters;
        selectOptionsElement.appendChild(option);
        option = localDefinitionSet.createOption();
        option.textContent = localDefinitionSet.characterRepertoireOptions.acceptPunctuationCharacters;
        selectOptionsElement.appendChild(option);
        selectOptionsElement.size = 2;
    } //if
    const checkedListBox = selectOptionsElement
        ? setupCheckedListBox(selectOptionsElement, [false, false],
            (index, _, value, initial) => {
                if (index == 0)
                    acceptBlankspaceCharacters = value;
                else
                    acceptPunctuationCharacters = value;
                if (!initial)
                    setRepertoire(selectOptionsElement);
                if (onCharacterSetChange)
                    onCharacterSetChange();    
            })
        : null;

    languageSelector.setOptionValues = (acceptBlankspaceCharactersValue, acceptPunctuationCharactersValue) => {
        checkedListBox.setValue(0, acceptBlankspaceCharactersValue);
        checkedListBox.setValue(1, acceptPunctuationCharactersValue);
    } //languageSelector.setOptionValues

    languageSelector.setLanguage = languageName => {
        for (let index in dictionaries.list)
            if (dictionaries.list[index].languageName == languageName) {
                selectLanguageElement.selectedIndex = index;
                selectedLanguage = dictionaries.list[index];
                break;
            } //if
        setRepertoire();
    } //languageSelector.setLanguage

     (() => { //makeEqualHeight
        if (!selectOptionsElement) return;
        const pixelSize = size => `${size}px`;
        if (selectOptionsElement.children.length > 0 && selectLanguageElement.children.length > 0) {
            const height =  Math.max(selectOptionsElement.firstChild.offsetHeight, selectLanguageElement.firstChild.offsetHeight);
            for (let child of selectOptionsElement.children)
                child.style.minHeight = pixelSize(height);
            for (let child of selectLanguageElement.children)
                child.style.minHeight = pixelSize(height);
        } //if
        const height =  Math.max(selectOptionsElement.offsetHeight, selectLanguageElement.offsetHeight);
        selectLanguageElement.style.height = pixelSize(height);
        selectOptionsElement.style.height = pixelSize(height);
    })(); //makeEqualHeight

    return languageSelector;
};
