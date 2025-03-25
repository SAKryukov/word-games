/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const createSortedWordList = (parent, hightlightClass, callback) => {   
    //callback(int wordCount)
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
        const wrapper = document.createElement("div");
        wrapper.textContent = word;
        wrapper.tabIndex = 0;
        wrapper.onkeydown = event => {
            switch (event.key) {
                case "ArrowRight":
                    event.target.nextSibling?.focus(); break;
                case "ArrowLeft":
                    event.target.previousSibling?.focus(); break;
                case "Home":
                    event.target.parentElement.firstChild.focus(); break;
                case "End": 
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
    
    result.toJSON = gameData => {
        gameData.alphabetical = [];
        for (let index = 0; index < parent.childElementCount; ++index)
            gameData.alphabetical.push(parent.children[index].textContent);
        return JSON.stringify(gameData);
    }; //result.toJSON

    return result;
} //createSortedWordList
