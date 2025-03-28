/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const createTableInput = (element, initialWidth, initialHeight) => {
    const tableInput = {};

    if (!element)
        element = document.createElement("table");
    element.tabIndex = 0;

    const cellMap = new Map();

    let selectedClassName = "selected";
    let readonlyClassName = "readonly"; 
    let nonSelectableClassName = "non-selectable"; 
    let body = null;
    let currentWidth = null, currentHeight = null;
    let currentX = null, currentY = null;
    let enterCallback, characterInputCallback = null;

    Object.defineProperties(tableInput, {
        tableElement: {
            get() { return element; },
        },
        selectedClassName: {
            get() { return selectedClassName; },
            set(value) { selectedClassName = value; },
        },
        readonlyClassName: {
            get() { return readonlyClassName; },
            set(value) { readonlyClassName = value; },
        },
        nonSelectableClassName: {
            get() { return nonSelectableClassName; },
            set(value) { nonSelectableClassName = value; },
        },
        x: {
            get() { return currentX; }
        },
        y: {
            get() { return currentY; }
        },
        width: {
            get() { return currentWidth; }
        },
        height: {
            get() { return currentHeight; }
        },
        enterCallback: { // enterCallback(cell, x, y);
            set(value) { enterCallback = value; }
        },
        characterInputCallback: { // characterInputCallback(cell, event)
            set(value) { characterInputCallback = value; }
        },
    }); //Object.defineProperties

    tableInput.focus = () => element.focus();

    const findCell = (x, y) => 
        element.rows[y]?.cells[x];

    const setClass = (x, y, doSet, className) => {
        const cell = findCell(x, y);
        if (!cell) return;
        if (doSet)
            cell.classList.add(className);
        else
            cell.classList.remove(className);
        return cell;
    }; //setClass

    tableInput.enableCell = (x, y, doEnable) =>
        setClass(x, y, !doEnable, nonSelectableClassName);
    tableInput.setReadonly = (x, y, doSet) => 
        setClass(x, y, doSet, readonlyClassName);

    tableInput.setReadonlyRow  = (row, start, length, doSet) => {
        for (let index = start; index < start + length; ++index)
            tableInput.setReadonly(index, row, doSet);
    } //tableInput.setReadonlyRow

    tableInput.putCharacter = (x, y, character) => {
        const cell = findCell(x, y);
        if (!cell) return;
        cell.textContent = character;
        return cell;
    } //tableInput.putCharacter

    tableInput.getCharacter = (x, y) => {
        const cell = findCell(x, y);
        if (!cell) return;
        return cell.textContent;
    } //tableInput.putCharacter

    const unselect = () => {
        if (currentX != null && currentX != null) {
            const previousSelection = findCell(currentX, currentY);
            previousSelection.classList.remove(selectedClassName);
        }
    } //unselect

    tableInput.select = (x, y) => {
        const cell = findCell(x, y);
        if (!cell) return;
        cell.classList.add(selectedClassName);
        if (x != currentX || y != currentY)
            unselect();
        currentX = x;
        currentY = y;
        return cell;
    } //tableInput.putCharacter

    const setupCell = (cell, x, y) => {
        cellMap.set(cell, {x: x, y: y});
        cell.onclick = event => {
            const cell = event.target;
            if (cell.classList.contains(nonSelectableClassName))
                return;
            cell.classList.add(selectedClassName);
            if (x != currentX || y != currentY)
                unselect();
            const cellData = cellMap.get(cell);
            currentX = cellData.x;
            currentY = cellData.y;
        }; //cell.onclick
    } //setupCell

    tableInput.reset = (width, height) => {
        cellMap.clear();
        currentWidth = null;
        currentHeight = null;
        currentX = null;
        currentY = null;
        element.innerHTML = null;
        body = element.createTBody();
        for (let rowIndex = 0; rowIndex < height; ++rowIndex) {
            const row = body.insertRow();
            for (let columnIndex = 0; columnIndex < width; ++columnIndex)
                setupCell(row.insertCell(), columnIndex, rowIndex);
        } //loop rows
        currentWidth = width;
        currentHeight = height;
    }; //tableInput.reset

    tableInput.addRow = () => {
        if (currentWidth == null || currentHeight == null)
            tableInput.reset(initialWidth, initialHeight);
        const rowNumber = body.rows.length;
        const row = body.insertRow();
        for (let columnIndex = 0; columnIndex < currentWidth; ++columnIndex)
            setupCell(row.insertCell(), columnIndex, rowNumber);
        ++currentHeight;
        return row;
    } //tableInput.addRow

    tableInput.insertCell = atIndex => {
        if (currentWidth == null || currentHeight == null)
            return;
        if (atIndex < 0 || atIndex >= currentWidth)
            return;
        for (let rowIndex = 0; rowIndex < currentHeight; ++rowIndex)
            body.rows[rowIndex].insertCell(atIndex);
        ++currentWidth;
        cellMap.clear();
        for (let rowIndex = 0; rowIndex < currentHeight; ++rowIndex) {
            for (let columnIndex = 0; columnIndex < currentWidth; ++columnIndex) {
                const cell = body.rows[rowIndex].cells[columnIndex];
                setupCell(cell, columnIndex, rowIndex);
            } //loop columns
        } //loop rows
        if (atIndex <= currentX)
            ++currentX;
    }; //tableInput.insertCell

    tableInput.addCell = () => tableInput.insertCell();

    const isRowTextContent = (row, requiredEmpty) => {
        for (let x = 0; x < currentWidth; ++x) {
            const cell = findCell(x, row);
            if (!cell) return;
            if (cell.classList.contains(readonlyClassName)) 
                continue;
            if ((requiredEmpty && cell.textContent)
                || (!requiredEmpty && !cell.textContent))
                    return false;
        } //loop
        return true;
    } //isRowTextContent
    tableInput.isRowFilledIn = row => isRowTextContent(row, false);
    tableInput.isRowEmpty = row => isRowTextContent(row, true);

    const move = (dx, dy) => {
        const x = currentX + dx;
        const y = currentY + dy;
        const cell = findCell(x, y);
        if (!cell) return;
        const newCell = findCell(x, y);
        if (newCell.classList.contains(nonSelectableClassName))
            return;
        tableInput.select(x, y);
        currentX = x;
        currentY = y;
    }; //move
    element.onkeydown = event => {
        if (currentX == null || currentY == null)
            return;
        const cell = findCell(currentX, currentY);
        if (cell == null)
            return;
        switch (event.key) {
            case "ArrowRight":
                move(1, 0);
                break;
            case "ArrowLeft":
                move(-1, 0);
                break;
            case "ArrowDown":
                move(0, 1);
                break;
            case "ArrowUp":
                move(0, -1);
                break;
            case "Enter":
                if (enterCallback)
                    enterCallback(cell, currentX, currentY);
            default:
                if (!cell.classList.contains(readonlyClassName)) {
                    if (characterInputCallback)
                        characterInputCallback(cell, event);
                    const next = cell.nextSibling;
                    if (!next) return;
                    if (next.classList.contains(readonlyClassName)) return;
                    if (next.classList.contains(readonlyClassName)) return;
                    if (next.disabled) return;
                    const cellData = cellMap.get(next);
                    tableInput.select(cellData.x, cellData.y, true);                    
                } //if
        }
    } //element.onkeydown

    return tableInput;
};
