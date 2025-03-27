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
    let enterCallback = null;

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
        enterCallback: {
            set(value) { enterCallback = value; }
        },
    }); //Object.defineProperties

    const findCell = (x, y) => 
        element.rows[y]?.cells[x];

    tableInput.enableCell = (x, y, doEnable) => {
        const cell = findCell(x, y);
        if (!cell) return;
        if (doEnable)
            cell.classList.remove(nonSelectableClassName);
        else
            cell.classList.add(nonSelectableClassName);
    }; //tableInput.enableCell

    tableInput.putCharacter = (x, y, character) => {
        const cell = findCell(x, y);
        if (!cell) return;
        cell.textContent = character;
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
        unselect();
        currentX = x;
        currentY = y;
    } //tableInput.putCharacter

    const setupCell = (cell, x, y) => {
        cellMap.set(cell, {x: x, y: y});
        cell.onclick = event => {
            const cell = event.target;
            if (cell.classList.contains(nonSelectableClassName))
                return;
            cell.classList.add(selectedClassName);
            unselect();
            const cellData = cellMap.get(cell);
            currentX = cellData.x;
            currentY = cellData.y;
        }; //cell.onclick
    } //setupCell

    tableInput.reset = (width, height, callback) => {
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
        if (callback)
            callback();
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

    tableInput.insertCell = atIndex => { // to fix (optimise):
        const oldCurrentX = currentX;
        const oldCurrentY = currentY;
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
        for (let rowIndex = 0; rowIndex < currentHeight; ++rowIndex) {
            for (let columnIndex = 0; columnIndex < currentWidth; ++columnIndex) {
                const cell = body.rows[rowIndex].cells[columnIndex];
                if (!cell.classList.contains(nonSelectableClassName))
                    tableInput.select(columnIndex, rowIndex);
            } //loop columns
        } //loop rows
        tableInput.select(oldCurrentX, oldCurrentY);
    }; //tableInput.insertCell

    tableInput.addCell = () => tableInput.insertCell();

    const isRowTextContent = (row, requiredEmpty) => { //SA??? to fix:
        const result = true;
        for (let x = 0; x < currentX; ++x) {
            const cell = findCell(x, row);
            if (!cell) exit;
            // SA??? check for readonly here
            if ((requiredEmpty && cell.textContent)
                || (!requiredEmpty && !cell.textContent))
                    return false;
        } //loop
        return result;
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
        const table = event.target;
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
                    enterCallback();
            default: //SA???
                if (event.key && event.key.length == 1)
                    cell.textContent = event.key.toUpperCase();
        }
    } //element.onkeydown

    return tableInput;
};

