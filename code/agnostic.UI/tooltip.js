/*

  Tooltips
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games

  Element can have dataset.verticalTooltip
  for example:

  <option data-vertical-tooltip="false">Start game</option>
  <select data-vertical-tooltip="true"></select>

  verticalTooltip indicates the priority to place a tooltop above or below the target element
  if "true" or undefined, verticalTooltip is the priority
  if "false," the priority is horizontal: place tooltip on left or on right of the target element

*/

"use strict";

const createTooltip = (elementTag, cssClass, showTime) => {
    const toolTip = {};

    const localDefinitionSet = {
        toPixel: value => `${value}px`,
        gap: 1,
        empty: "",
        allElements: "*",
        displayAbsolute: element => element.style.position = "absolute",
        events: {
            onPointerEnter: (targetElement, eventHander) =>
                targetElement.addEventListener("pointerenter", eventHander),
            onPointerLeave: (targetElement, eventHander) =>
                targetElement.addEventListener("pointerleave", eventHander),
            onPointerBlur: (targetElement, eventHander) =>
                targetElement.addEventListener("blur", eventHander),
        },
        show: element => element.style.display = "block",
        hide: element => element.style.display = "none",
    }; //localDefinitionSet

    let timeout = null;

    const element = document.createElement(elementTag);
    localDefinitionSet.hide(element);
    localDefinitionSet.displayAbsolute(element);
    element.classList.add(cssClass);
    document.body.appendChild(element);

    const show = (html, target, priorityVertical, x, y) => {
        const estimateLocation = (lowerEdge, higherEdge, max, tooltipSize) => {
            tooltipSize += localDefinitionSet.gap;
            // testing hightEdge, first priority:
            if (max - higherEdge >= tooltipSize)
                return { good: true, position: higherEdge };
            // testing lowerEdge, second priority:
            else if (lowerEdge >= tooltipSize)
                return { good: true, position: lowerEdge - tooltipSize };
            else { //no good, better to try another direction, but:
                if (max - higherEdge >= lowerEdge)
                    return{ good: true, position: higherEdge + localDefinitionSet.gap };
                else
                    return { good: true, position: lowerEdge - tooltipSize };
            } //if
        }; //estimateLocation
        element.style.right = null;
        element.style.left = null;
        element.style.top = null;
        element.style.bottom = null;
        element.innerHTML = html;
        localDefinitionSet.show(element);
        const elementSize = element.getBoundingClientRect();
        const location = target.getBoundingClientRect();
        const horizontal = estimateLocation (location.left, location.right, window.innerWidth, elementSize.width);
        const vertical = estimateLocation (location.top, location.bottom, window.innerHeight, elementSize.height);
        let isVertical = priorityVertical == null ? true : priorityVertical;
        if (isVertical) {
            y = vertical.position + localDefinitionSet.gap;
            x = location.left;
        } else {
            x = horizontal.position + localDefinitionSet.gap;
            y = location.top;
        } //if
        if (x < localDefinitionSet.gap)
            x = localDefinitionSet.gap;
        if (x > window.innerWidth - elementSize.width - localDefinitionSet.gap)
            x = window.innerWidth - elementSize.width - localDefinitionSet.gap;
        if (y < localDefinitionSet.gap)
            y = localDefinitionSet.gap;
        if (y > window.innerHeight - elementSize.height - localDefinitionSet.gap)
            y = window.innerHeight - elementSize.height - localDefinitionSet.gap;
        element.style.left = localDefinitionSet.toPixel(x);
        element.style.top = localDefinitionSet.toPixel(y);
    }; //show
    const hide = fromTimeout => {
        localDefinitionSet.hide(element);
        if (!fromTimeout && timeout != null)
            clearTimeout(timeout);
    }; //hide

    const elementMap = new Map();

    (() => { //events
        const elements = document.querySelectorAll(localDefinitionSet.allElements);
        for (let targetElement of elements) {
            if (targetElement.title) {
                elementMap.set(targetElement, { title: targetElement.title, });
                targetElement.title = localDefinitionSet.empty;
            } else
                continue;
            localDefinitionSet.events.onPointerEnter(targetElement, event => {
                if (timeout != null)
                    clearTimeout(timeout);
                const value = elementMap.get(event.target);
                element.innerHTML = localDefinitionSet.empty;
                let priorityVertical = null;
                if (event.target.dataset.verticalTooltip != null) {
                    const data = event.target.dataset.verticalTooltip;
                    if (data.toLowerCase() == false.toString())
                        priorityVertical = false;
                    else if (data.toLowerCase() == true.toString())
                        priorityVertical = false;
                } //if
                show(value.title, event.target, priorityVertical, event.pageX, event.pageY);
                if (showTime)
                    timeout = setTimeout(hide, showTime, true);
            });
            localDefinitionSet.events.onPointerLeave(targetElement, hide);
            localDefinitionSet.events.onPointerBlur(targetElement, hide);
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
