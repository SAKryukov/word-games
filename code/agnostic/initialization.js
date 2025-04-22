/*
  Read-only namespaces
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const initialize = (() => {

    const definitionSet = {
        document: {
            events: {
                DOMContentLoaded: 0,
                readystatechange: 0,
            },
            readyState: { // in the time order:
                loading: 0, // initial
                interactive: 0,
                complete: 0,
            },
        },
        window: {
            events: {
                load: 0,
            },
        },
        initialize: function () {
            for (let dictionary of [
                this.document.events,
                this.window.events,
                this.document.readyState])
                    for (let index in dictionary)
                        dictionary[index] = index;        
        },
    }; //definitionSet
    definitionSet.initialize();

    const onBeforeDOMContentLoaded = handler =>
        document.addEventListener(definitionSet.document.events.readystatechange, event => {
            if (document.readyState == definitionSet.document.readyState.interactive)
                handler(event);
        });

    const onBeforeLoad = handler =>
        document.addEventListener(definitionSet.document.events.readystatechange, event => {
            if (document.readyState == definitionSet.document.readyState.complete)
                handler(event);
        });
    
    const onDOMContentLoaded = handler =>
        document.addEventListener(definitionSet.document.events.DOMContentLoaded, handler);

    const onLoad = handler =>
        window.addEventListener(definitionSet.window.events.load, handler);

    const api = { onBeforeDOMContentLoaded, onDOMContentLoaded, onBeforeLoad, onLoad, };
    
    Object.freeze(api);
    return api;
    
})();
