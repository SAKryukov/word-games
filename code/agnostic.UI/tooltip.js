/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const createTooltip = (elementTag, cssClass, showTime) => {
    const toolTip = {};

    let timeout = null;

    const toPixel = value => `${value}px`;

    const element = document.createElement(elementTag);
    element.style.display = "none";
    element.style.position = "absolute";
    element.classList.add(cssClass);
    document.body.appendChild(element);

    const show = (html, target, x, y) => {
        const estimateLocation = (lowerEdge, higherEdge, max, tooltipSize) => {
            // testing hightEdge, first priority:
            if (max - higherEdge >= tooltipSize)
                return { good: true, position: higherEdge };
            // testing lowerEdge, second priority:
            else if (lowerEdge >= tooltipSize)
                return { good: true, position: lowerEdge - tooltipSize };
            else { //no good, better to try another direction, but:
                if (max - higherEdge >= lowerEdge)
                    return{ good: true, position: higherEdge };
                else
                    return { good: true, position: lowerEdge - tooltipSize };
            } //if
        }; //estimateLocation
        element.style.right = null;
        element.style.left = null;
        element.style.top = null;
        element.style.bottom = null;
        element.innerHTML = html;
        element.style.display = "block";
        const elementSize = element.getBoundingClientRect();
        const location = target.getBoundingClientRect();
        const horizontal = estimateLocation (location.left, location.right, window.innerWidth, elementSize.width);
        let vertical = {}, finalPosition = {}; 
        if (!horizontal.good)
            vertical = estimateLocation (location.top, location.bottom, window.innerHeight, elementSize.height);
        if (horizontal.good)
            finalPosition = { x: horizontal.position, y: y };
        else
            finalPosition = { x: x, y: vertical.position };
        x = finalPosition.x;
        if (x < 0)
            x = 0;
        if (x > window.innerWidth - elementSize.width)
            x = window.innerWidth - elementSize.width;
        if (y < 0)
            y = 0;
        if (y > window.innerHeight - elementSize.height)
            y = window.innerHeight - elementSize.height;
        element.style.left = toPixel(x);
        element.style.top = toPixel(y);
    }; //show
    const hide = fromTimeout => {
        element.style.display = "none";
        if (!fromTimeout && timeout != null)
            clearTimeout(timeout);
    }; //hide

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
                if (timeout != null)
                    clearTimeout(timeout);
                const value = elementMap.get(event.target);
                element.innerHTML = "";
                show(value.title, event.target, event.pageX, event.pageY);
                if (showTime)
                    timeout = setTimeout(hide, showTime, true);
            });
            targetElement.addEventListener("pointerleave", hide);
            targetElement.addEventListener("blur", hide);
        } //loop
    })();

    Object.defineProperties(toolTip, {
        show: {
            get() { return show; }
        },
        hide: {
            get() { return hide; }
        }
    });

    Object.freeze(toolTip);
    return toolTip;
};
