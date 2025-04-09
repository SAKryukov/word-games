/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const createTooltip = (elementTag, cssClass, /* SA??? */ hideDelay, showDelay = 0) => {
    const toolTip = {};

    const toPixel = value => `${value}px`;

    const element = document.createElement(elementTag);
    element.style.display = "none";
    element.style.position = "absolute";
    element.classList.add(cssClass);
    document.body.appendChild(element);

    const show = (html, target, x, y) => {
        element.style.right = null;
        element.style.left = null;
        element.style.top = null;
        element.style.bottom = null;
        const location = target.getBoundingClientRect();
        element.innerHTML = html;
        element.style.display = "block";
        const elementSize = element.getBoundingClientRect();
        let horizontal = true;
        {
            const low = location.left;
            const high = window.innerWidth - location.right;
            if (elementSize.width > low &&  elementSize.width > high)
                horizontal = false;
            let position;
            if (horizontal) {
                if (low > high) {
                    position = window.innerWidth - location.left;
                    if (position < 0)
                        position = 0;
                    element.style.right = toPixel(position); 
                } else {
                    position = toPixel(location.right);
                    if (position > window.innerWidth - elementSize.width)
                        position = window.innerWidth - elementSize.width;
                    element.style.left = toPixel(position); 
                }
            } //if
        } //horisonatal
        if (!horizontal) {
            const low = location.top;
            const high = window.innerHeight - location.bottom;
            let position;
            if (low > high) {
                position = window.innerHeight - location.top; 
                if (position < 0)
                    position = 0;
                element.style.bottom = toPixel(position);
            } else {
                position = location.bottom;
                if (position > window.innerHeight - elementSize.height)
                    position = window.innerHeight - elementSize.height;
                element.style.top = toPixel(position);
            } //if
        } //!horisonatal
        let position;
        if (horizontal) {
            position = y;
            if (position < 0)
                position = 0;
            else if (position > window.innerHeight - elementSize.height)
                position = window.innerHeight - elementSize.height;
            element.style.top = toPixel(position);
        } else {
            position = location.left;
            if (position < 0)
                position = 0;
            else if (position > window.innerWidth - elementSize.width)
                position = window.innerWidth - elementSize.width;
            element.style.left = toPixel(position);
        } //if
    }; //show
    const hide = () => element.style.display = "none";

    const elementMap = new Map();

    (() => { //events
        const elements = document.querySelectorAll("*");
        for (let targetElement of elements) {
            if (targetElement.title) {
                elementMap.set(targetElement, { title: targetElement.title, });
                targetElement.title = "";
            } else
                continue;
            targetElement.addEventListener("pointerenter", event => {
                const value = elementMap.get(event.target);
                element.innerHTML = "";
                show(value.title, event.target, event.pageX, event.pageY);    
                //setInterval(() => hide(), showDelay);
            });
            targetElement.addEventListener("pointerleave", () => hide());
        }
    })();

    Object.freeze(toolTip);
    return toolTip;
};
