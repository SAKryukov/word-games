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

    const localDefinitionSet = {
        defaults: {
            timeout: 10000,
            priorityDataSetName: "tooltipPriority",
            priorities: ["bottom", "right", "top", "left"],
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
        };
        for (let index in tooltipPriorities)
            tooltipPriorities[index] = index;
        tooltipPriorities.fromStringArray = values => {
            const result = [];
            if (!values) return result;
            for (let value of values)
                if (tooltipPriorities[value])
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
                switch (priority) {
                    case tooltipPriorities.left:
                        if (horizontal.lowerPositionRoom >= 0)
                            return { x: horizontal.lowerPosition, y: location.top };
                    case tooltipPriorities.right:
                        if (horizontal.higherPositionRoom >= 0)
                            return { x: horizontal.higherPosition, y: location.top };
                    case tooltipPriorities.top:
                        if (vertical.lowerPositionRoom >= 0)
                            return { x: location.left, y: vertical.lowerPosition };
                    case tooltipPriorities.bottom:
                        if (vertical.higherPositionRoom >= 0)
                            return { x: location.left, y: vertical.higherPosition };
                } //switch
            } //loop
            let maxRoom = -window.innerWidth;
            let optimalLocation = null;
            for (let priority of prioritySequence) {
                switch (priority) {
                    case tooltipPriorities.left:
                        if (horizontal.lowerPositionRoom > maxRoom) {
                            maxRoom = horizontal.lowerPositionRoom;
                            optimalLocation = priority;
                        }
                        break;
                    case tooltipPriorities.right:
                        if (horizontal.higherPositionRoom > maxRoom) {
                            maxRoom = horizontal.higherPositionRoom;
                            optimalLocation = priority;
                        }
                        break;
                    case tooltipPriorities.top:
                        if (vertical.lowerPositionRoom > maxRoom) {
                            maxRoom = vertical.lowerPositionRoom;
                            optimalLocation = priority;
                        }
                        break;
                    case tooltipPriorities.bottom:
                        if (vertical.higherPositionRoom > maxRoom) {
                            maxRoom = vertical.higherPositionRoom;
                            optimalLocation = priority;
                        }
                        break;
                } //switch               
                switch (optimalLocation) {
                    case tooltipPriorities.left:
                        return { x: horizontal.lowerPosition, y: location.top };
                    case tooltipPriorities.right:
                        return { x: horizontal.higherPosition, y: location.top };
                    case tooltipPriorities.top:
                        return { x: location.left, y: vertical.lowerPosition };
                    case tooltipPriorities.bottom:
                        return { x: location.left, y: vertical.higherPosition };
                } //switch               
            } //loop
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
            set(values) { priorities = tooltipPriorities.fromStringArray(values); },
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
