/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

window.onload = () => {

    const elementSet = getElementSet(null); //SA???
    const languageSelector =
        createLanguageSelector(elementSet.input.languageSet, null, () => {
          //SA???
    });

    elementSet.input.buttonStart.onclick = () => {
      //SA???
    }; //elementSet.input.buttonStart.onclick

    (() => { // product:
      elementSet.product.title.textContent = definitionSet.title;
      elementSet.product.version.innerHTML = definitionSet.version;
      elementSet.product.copyrightYears.textContent = definitionSet.copyrightYears;
  })(); //product

}; //window.onload
