/*
  Read-only namespaces
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const initialize = (() => {

    const localDefinitionSet = {
        document: {
            events: {
                DOMContentLoaded: 0,
                readystatechange: 0,
            },
            readyState: { // in the time order:
                loading: 0, // initial
                interactive: 0,
                complete: 0,
            }
        },
    }; //localDefinitionSet
    for (let index in localDefinitionSet.document.events)
        localDefinitionSet.document.events[index] = index;
    for (let index in localDefinitionSet.document.readyState)
        localDefinitionSet.document.readyState[index] = index;

    const onBeforeDOMContentLoaded = method => {
        document.onreadystatechange = event => {
            if (document.readyState === localDefinitionSet.document.readyState.interactive)
                method(event);
        };
    }; //onBeforeDOMContentLoaded

    const onBeforeLoad = method => {
        document.onreadystatechange = event => {
            if (method && document.readyState === localDefinitionSet.document.readyState.complete)
                method(event);
        };
    }; //onBeforeLoad
    
    const onDOMContentLoaded = method =>
        document.addEventListener(localDefinitionSet.document.events.DOMContentLoaded, method);

    const onLoad = method => window.onload = method;

    const api = { onBeforeDOMContentLoaded, onDOMContentLoaded, onBeforeLoad, onLoad, };
    
    Object.freeze(api);
    return api;
    
})();
