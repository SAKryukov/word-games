/*

  Tooltips
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games

  A target element can have dataset.tooltipPriority,
  for example:

  <option data-tooltip-priority="top right"></option>
  <select data-tooltip-priority="bottom"></select>
  <select data-tooltip-priority="pointer"></select>

  tooltipPriority indicates the priority to place a tooltop above or below the target element
  if undefined, the default priorites are used: 
  
  The property name "tooltipPriority" is the default value for the property priorityDataSetName.
  It can be modified, and its name should match the HTML custom syntax:
  data-tooltip-priority <-> tooltipPriority, and the like.

*/

"use strict";

const createTooltip = elementTag => {
    const toolTip = {};

    const localDefinitionSet = {
        defaults: {
            timeout: 10000,
            priorityDataSetName: "tooltipPriority",
            priorities: ["bottom", "right", "top", "left"], // the array length should be 4 or 5
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

    const tooltipPriorities = (() => {
        const tooltipPriorities = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            pointer: 0, // depending on mouse/pointer location
        };
        tooltipPriorities.left = (location, horizontal, _) => {
            return { room: horizontal.lowerPositionRoom, x: horizontal.lowerPosition, y: location.top }; }
        tooltipPriorities.right = (location, horizontal, _) => {
                return { room: horizontal.higherPositionRoom, x: horizontal.higherPosition, y: location.top }; }
        tooltipPriorities.top = (location, _, vertical) => {
                return { room: vertical.lowerPositionRoom, x: location.left, y: vertical.lowerPosition }; }
        tooltipPriorities.bottom = (location, _, vertical) => {
                return { room: vertical.higherPositionRoom, x: location.left, y: vertical.higherPosition }; }
        tooltipPriorities.fromStringArray = values => {
            const result = [];
            if (!values) return result;
            for (let value of values)
                if (tooltipPriorities[value] != null)
                    result.push(tooltipPriorities[value]);
            return result;
        }; //fromStringArray    
        Object.freeze(tooltipPriorities);
        return tooltipPriorities;
    })();

    const element = document.createElement(elementTag);
    let cssClass = null;
    let showTime = localDefinitionSet.defaults.timeout;
    let priorityDataSetName = localDefinitionSet.defaults.priorityDataSetName;
    let priorities = tooltipPriorities.fromStringArray(localDefinitionSet.defaults.priorities);
    let onClickHandler = null;
    let timeout = null;

    localDefinitionSet.hide(element);
    localDefinitionSet.displayAbsolute(element);
    document.body.appendChild(element);

    const show = (html, target, customPriorities, x, y) => {
        let prioritySequence = tooltipPriorities.fromStringArray(customPriorities);
        if (prioritySequence.length < 1)
            prioritySequence = priorities;
        const estimateLocation = (lowerEdge, higherEdge, max, tooltipSize) => {
            const higherPosition = higherEdge + localDefinitionSet.lowerGap;
            const lowerPosition = lowerEdge - tooltipSize - localDefinitionSet.upperGap;
            const higherPositionRoom = (max - higherEdge - tooltipSize) / tooltipSize;
            const lowerPositionRoom = (lowerEdge - tooltipSize) / tooltipSize;
            return { lowerPosition, higherPosition, lowerPositionRoom, higherPositionRoom};
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
        const locationFromPriorities = () => {
            for (let priority of prioritySequence) {
                if (priority == tooltipPriorities.pointer) // special case, no evaluation function:
                    if (x != null && y != null)
                        return { x, y };
                    else
                        continue;
                const evaluation = priority(location, horizontal, vertical, x, y);
                if (evaluation.room >= 0)
                    return { x: evaluation.x, y: evaluation.y };
            } //loop
            let maxRoom = Number.MIN_SAFE_INTEGER;
            let optimalLocation = null;
            for (let priority of prioritySequence) {
                const evaluation = priority(location, horizontal, vertical, x, y);
                if (evaluation.room > maxRoom) {
                    optimalLocation = priority;
                    maxRoom = evaluation.room;
                } //if
            } //loop
            const evaluation = optimalLocation(location, horizontal, vertical, x, y);
            return  { x: evaluation.x, y: evaluation.y };
        }; //locationFromPriorities
        const tooltipLocation = locationFromPriorities();
        x = tooltipLocation.x;
        y = tooltipLocation.y;
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
        priorityDataSetName: {
            get() { return priorityDataSetName; },
            set(value) { priorityDataSetName = value; },
        },
        priorities: {
            get() { return priorities; },
            set(values) {
                priorities = tooltipPriorities.fromStringArray(values);
                if (priorities.length > 1)
                    priorities = tooltipPriorities.fromStringArray(localDefinitionSet.defaults.priorities);
            },
        },
        show: {
            get() { return show; },
        },
        hide: {
            get() { return hide; },
        },
    });

    Object.freeze(toolTip);
    return toolTip;
};
