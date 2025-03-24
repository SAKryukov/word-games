/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const createRepertoireSelector = (gameDefinitionSet, selectLanguageElement, selectOptionsElement) => {
    const repertoireSelector = {};

    const characterRepertoire = null;

    repertoireSelector.getRepertoire = () => characterRepertoire;

    if (selectOptionsElement) {
        let option = document.createElement("option");
        option.textContent = gameDefinitionSet.characterRepertoireOptions.acceptBlankspaceCharacters;
        selectOptionsElement.appendChild(option);
        option = document.createElement("option");
        option.textContent = gameDefinitionSet.characterRepertoireOptions.acceptPunctuationCharacters;
        selectOptionsElement.appendChild(option);
        document.createElement("option");
        selectOptionsElement.size = 2;
        selectLanguageElement.selectedIndex = 0;
    } //if

    return repertoireSelector;
};