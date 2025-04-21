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
                <table><tr>${cells}</tr></table>`
        },
        empty: "",
        paste: {
            onPaste: (targetElement, eventHander) =>
                targetElement.addEventListener("paste", eventHander),
            getClipboardText: event => event.clipboardData.getData("text"),
            insert: (before, value, after) => `${before}${value}${after}`,
        },
    }; //localDefinitionSet

    let repertoire = null;
    let selectedLanguage = null;
    let acceptBlankspaceCharacters = false;
    let acceptPunctuationCharacters = false;
    let onCharacterSetChange = null;
    let onPaste = null;
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
        onPaste: {
            set(value) { onPaste = value; },
        },
        tooltip: {
            set(value) {
                tooltip = value;
                if (!tooltip) return;
                tooltip.onClickHandler = event => {
                    if (
                        event.target == selectLanguageElement
                        || (event.target.parentElement
                            && (event.target.parentElement == selectLanguageElement)))
                                setRepertoire(selectLanguageElement);
                    else if (
                        event.target == selectOptionsElement
                        || (event.target.parentElement
                            && (event.target.parentElement == selectOptionsElement)))
                                setRepertoire(selectOptionsElement);
                }; //tooltip.onClickHandler
            },            
        },
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
		if (repertoire.indexOf(char.toLowerCase()) >= 0)
            return true;
		if (event.preventDefault) event.preventDefault();
		return false;
    }; //filterOut

    languageSelector.setPasteFilter = element => {
        localDefinitionSet.paste.onPaste(element, event => {
            const data = localDefinitionSet.paste.getClipboardText(event);
            event.preventDefault();
            let result = localDefinitionSet.empty;
            for (let character of data)
                if (repertoire.indexOf(character.toLowerCase()) >= 0)
                    result += character;
            const startPos = event.target.selectionStart;
            const endPos = event.target.selectionEnd;
            event.target.value =
                localDefinitionSet.paste.insert(
                    event.target.value.substring(0, startPos),
                    result,
                    event.target.value.substring(endPos, event.target.value.length));
                if (onPaste)
                    onPaste(event.target);
        });
    }; //pasteFilter

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
