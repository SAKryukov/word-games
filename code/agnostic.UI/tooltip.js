/*

  Tooltips
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games

  A target element can have dataset.tooltipPriority,
  for example:

  <option data-tooltip-priority="left right"></option>
  <select data-tooltip-priority="bottom"></select>

  tooltipPriority indicates the priority to place a tooltop above or below the target element
  if undefined, the default priorites are used: 
  
  The property name "tooltipPriority" is the default value for the property priorityDataSetName.
  It can be modified, and its name should match the HTML custom syntax:
  data-tooltip-priority <-> tooltipPriority, and the like.

*/

"use strict";

const createTooltip = elementTag => {
    const toolTip = {};

    const tooltipPriorities = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    };
    for (let index in tooltipPriorities)
        tooltipPriorities[index] = index;
    Object.freeze(tooltipPriorities);
    /*
    const priorityFromString = text => {
        for (let index in tooltipPriorities)
            if (text == index)
                return tooltipPriorities[index];
    }; //priorityFromString
    */
    const prioritiesFromStringArray = values => {
        const result = [];
        if (!values) return result;
        for (let value of values)
            if (tooltipPriorities[value])
                result.push(tooltipPriorities[value]);
        return result;
    }; //prioritiesFromStringArray

    const localDefinitionSet = {
        defaults: {
            timeout: 10000,
            isPriorityVertical: true, // SA??? temporary
            priorityDataSetName: "tooltipPriority",
            priorities: [tooltipPriorities.bottom, tooltipPriorities.left, tooltipPriorities.right, tooltipPriorities.top],
        },
        toPixel: value => `${value}px`,
        upperGap: 2,
        lowerGap: 1,
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
            onClick: (targetElement, eventHander) =>
                targetElement.addEventListener("click", eventHander),
        },
        show: element => element.style.display = "block",
        hide: element => element.style.display = "none",
        prioritySeparator: " ",
    }; //localDefinitionSet

    const element = document.createElement(elementTag);
    let cssClass = null;
    let showTime = localDefinitionSet.defaults.timeout;
    let isPriorityVertical = localDefinitionSet.defaults.isPriorityVertical;
    let priorityDataSetName = localDefinitionSet.defaults.priorityDataSetName;
    let priorities = localDefinitionSet.defaults.priorities;
    let onClickHandler = null;

    Object.defineProperties(toolTip, {
        onClickHandler: {
            set(value) { onClickHandler = value; },
        },
        cssClass: {
            get() { return cssClass; },
            set(value) {
                cssClass = value;
                element.classList.add(cssClass);
            },
        },
        showTime: {
            get() { return showTime; },
            set(value) { showTime = value; },
        },
        isPriorityVertical: {
            get() { return isPriorityVertical; },
            set(value) { isPriorityVertical = value; },
        },
        priorityDataSetName: {
            get() { return priorityDataSetName; },
            set(value) { priorityDataSetName = value; },
        },
        priorities: {
            get() { return priorities; },
            set(values) { priorities = prioritiesFromStringArray(values); },
        }
    }); //properties

    let timeout = null;

    localDefinitionSet.hide(element);
    localDefinitionSet.displayAbsolute(element);
    document.body.appendChild(element);

    const show = (html, target, priorities, x, y) => {
        const prioritySequence = prioritiesFromStringArray(priorities);
        const estimateLocation = (lowerEdge, higherEdge, max, tooltipSize) => {
            const higherPosition = higherEdge + localDefinitionSet.lowerGap;
            const lowerPosition = lowerEdge - tooltipSize - localDefinitionSet.upperGap;
            // testing hightEdge, first priority:
            if (max - higherEdge >= tooltipSize)
                return { good: true, position: higherPosition };
            // testing lowerEdge, second priority:
            else if (lowerEdge >= tooltipSize)
                return { good: true, position: lowerPosition };
            else { //no good, better to try another direction, but:
                if (max - higherEdge >= lowerEdge)
                    return{ good: true, position: higherPosition };
                else
                    return { good: true, position: lowerPosition };
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
        let isVertical = priorities == null // SA??? temporary
            ? isPriorityVertical
            : prioritySequence.length == 0;
        if (isVertical) { // SA??? temporary
            y = vertical.position;
            x = location.left;
        } else {
            x = horizontal.position;
            y = location.top;
        } //if
        if (x < localDefinitionSet.lowerGap)
            x = localDefinitionSet.lowerGap;
        if (x > window.innerWidth - elementSize.width - localDefinitionSet.upperGap)
            x = window.innerWidth - elementSize.width - localDefinitionSet.upperGap;
        if (y < localDefinitionSet.lowerGap)
            y = localDefinitionSet.lowerGap;
        if (y > window.innerHeight - elementSize.height - localDefinitionSet.upperGap)
            y = window.innerHeight - elementSize.height - localDefinitionSet.upperGap;
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
                let priorities = null;
                if (event.target.dataset[priorityDataSetName] != null) {
                    const data = event.target.dataset[priorityDataSetName];
                    priorities = data.split(localDefinitionSet.prioritySeparator);
                } //if
                show(value.title, event.target, priorities, event.pageX, event.pageY);
                if (showTime)
                    timeout = setTimeout(hide, showTime, true);
            });
            localDefinitionSet.events.onPointerLeave(targetElement, hide);
            localDefinitionSet.events.onPointerBlur(targetElement, hide);
            localDefinitionSet.events.onClick(targetElement, event => {
                if (onClickHandler != null)
                    onClickHandler(event)
            });
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
