/*
  Replace discouraged and non-portable accesskey attributes with key handling
  Event handling will not depend on language and other keyboard detail,
  as it is based on raw keyboard input

  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const fixAccessKeyAttributes = (altKey = true, shiftKey = false, ctrlKey = false, metaKey = false) => {

    const definitionSet = {
        accesskey: 0,
        keydown: 0,
        initialize: function () {
            for (let index in this)
                this[index] = index;
        }
    }; //definitionSet
    definitionSet.initialize();

    const eventMap = new Map();
    const elements = document.querySelectorAll(`[${definitionSet.accesskey}]`);

    for (let element of elements) {
        const key = element.getAttribute(definitionSet.accesskey);
        eventMap.set(key, {
            element: element,
            action: element instanceof HTMLButtonElement
                ? element => element.click() 
                : element => element.focus(),
        });
        element.removeAttribute(definitionSet.accesskey);
    } //loop

    window.addEventListener(definitionSet.keydown, event => {
        if (event.altKey != altKey) return;
        if (event.shiftKey != shiftKey) return;
        if (event.ctrlKey != ctrlKey) return;
        if (event.metaKey != metaKey) return;
        const value = eventMap.get(event.code);
        if (!value) return;
        if (!value.element.disabled)
            value.action(value.element);
        event.preventDefault();
}); //window.addEventListener

};
