/*
  Sorted word list
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const createSortedWordList = (parent, hightlightClass, callback) => {

    const definitionSet = {
        keys:  {
            ArrowRight: 0,
            ArrowLeft: 0,
            Home: 0,
            End: 0,
        },
        wrapperElement: "div",
        initialize: function() {
            for (let index in this.keys)
                this.keys[index] = index;
        },
    };
    definitionSet.initialize();

    const wordSet = new Set();
    let lastWrapper = null;
    const result = {};
    
    Object.defineProperties(result, {
        isEmpty: {
            get() { return wordSet.size < 1; },
            enumerable: true, 
        },
    }); //Object.defineProperties isEmpty

    result.refresh = ()=> { if (callback) callback(wordSet.size); }
    
    result.add = word => {
        const show = (element, hide) => {
            if (!hide) {
                element.classList.add(hightlightClass);
                element.scrollIntoView();
            } else
               element.classList.remove(hightlightClass);
        }; //show
        if (lastWrapper)
            show(lastWrapper, true); //hide
        if (wordSet.has(word)) {
            for (let index = 0; index < parent.childElementCount; ++index)
                if (parent.children[index].textContent == word) {
                    show(parent.children[index]);
                    lastWrapper = parent.children[index];
                    break;
                } //if
            return false;
        } //if
        wordSet.add(word);
        const wrapper = document.createElement(definitionSet.wrapperElement);
        wrapper.textContent = word;
        wrapper.tabIndex = 0;
        wrapper.onkeydown = event => {
            switch (event.code) {
                case definitionSet.keys.ArrowRight:
                    event.target.nextSibling?.focus(); break;
                case definitionSet.keys.ArrowLeft:
                    event.target.previousSibling?.focus(); break;
                case definitionSet.keys.Home:
                    event.target.parentElement.firstChild.focus(); break;
                case definitionSet.keys.End: 
                    event.target.parentElement.lastChild.focus(); break;
            }
        }; //wrapper.onkeydown
        if (parent.childElementCount > 0) {
            let added = false;
            for (let index = 0; index < parent.childElementCount; ++index) {
                let child = parent.children[index];
                if (child.textContent > word) {
                    parent.insertBefore(wrapper, child);
                    added = true;
                    break;
                } //if
            }
            if (!added)
                parent.appendChild(wrapper);
        } else
            parent.appendChild(wrapper);
        lastWrapper = wrapper;
        show(wrapper);
        if (callback)
            callback(wordSet.size);
        return true;
    }; //result.add
    
    result.reset = () => {
        wordSet.clear();
        while (parent.firstChild)
            parent.removeChild(parent.lastChild);
        if (callback)
            callback(wordSet.size);
    }; //result.reset
    
    result.updateGameData = gameData => {
        gameData.alphabetical = [];
        for (let index = 0; index < parent.childElementCount; ++index)
            gameData.alphabetical.push(parent.children[index].textContent);
    }; //result.updateGameData

    return result;
} //createSortedWordList
