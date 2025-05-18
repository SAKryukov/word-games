/*
  Table input
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const createTableInput = (element, scrollableElement, initialWidth, initialHeight, autoCarriage = true, empty = "?") => {
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
    let enterCallback, characterInputCallback, selectingCallback, selectedCallback = null;
    //selectingCallback, selectedCallback(oldX, oldY, newX, newY);

    const getRow = index => {
        const result = [];
        if (index < 0 || index >= currentHeight) return;
        for (let position = 0; position < currentWidth; ++position) {
            let character = tableInput.getCharacter(position, index)
            if (character == null || character.length < 1)
                character = empty;
            result.push(character);
        } //loop
        return result.join("");
    }; //getRow
    const putRow = (row, value) => {
        for (let index = 0; index < value.length; ++index) {
            let character = value.charAt(index);
            if (character == empty)
                character = null;
            tableInput.putCharacter(index, row, character);
        } //loop
    }; //putRow

    const currentCellHasClass = className => {
        if (currentX == null || currentY == null) return false;
        const cell = findCell(currentX, currentY);
        if (!cell) return false;
        return cell.classList.contains(className);
    } //currentCellHasClass

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
        isCurrentCellReadonly: {
            get() { return currentCellHasClass(readonlyClassName); }
        },
        isCurrentCellSelectable: {
            get() { return !currentCellHasClass(nonSelectableClassName); }
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
        characterInputCallback: { // characterInputCallback(cell, event) returns bool goodKey
            set(value) { characterInputCallback = value; }
        },
        selectingCallback: {
            set(value) { selectingCallback = value; }
        },
        selectedCallback: {
            set(value) { selectedCallback = value; }
        },
        text: {
            get() {
                const result = [];
                for (let index = 0; index < currentHeight; ++index)
                    result.push(getRow(index));
                return result;
            },
            set(value) {
                if (!value) return;
                if (!(value instanceof Array)) return;
                let rows = value.length;
                if (rows < 1) return;
                let width = 0;
                for (let word of value)
                    if (word.length > width) width = word.length;
                tableInput.reset(width, rows);
                for (let row = 0; row < rows; ++row)
                    putRow(row, value[row]);
            },
        }
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
        if (currentX != null && currentY != null) {
            const previousSelection = findCell(currentX, currentY);
            previousSelection.classList.remove(selectedClassName);
        }
    } //unselect

    if (!scrollableElement)
        scrollableElement = element.parentElement; 
    const isScrolledIntoView = cell => {
        const scrollableElement = element.parentElement;
        let cellRectangle = cell.getBoundingClientRect();
        let parentRectangle = scrollableElement.getBoundingClientRect();
        let isVisible =
            (cellRectangle.top >= parentRectangle.top) &&
            (cellRectangle.bottom <= parentRectangle.bottom);
        return isVisible;
    }; //isScrolledIntoView
    
    const scrollIntoView = cell => {
        if (!isScrolledIntoView(cell))
            cell.scrollIntoView();
    } //scrollIntoView

    tableInput.select = (x, y) => {
        const cell = findCell(x, y);
        if (!cell) return;
        if (selectingCallback)
            selectingCallback(currentX, currentY, x, y);
        cell.classList.add(selectedClassName);
        if (x != currentX || y != currentY)
            unselect();
        currentX = x;
        currentY = y;
        scrollIntoView(cell);
        if (selectedCallback)
            selectedCallback(currentX, currentY, x, y);
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
            if (!cell) return;
            scrollIntoView(cell);
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
        for (let columnIndex = 0; columnIndex < currentWidth; ++columnIndex) {
            const cell = row.insertCell();
            scrollIntoView(cell);
            setupCell(cell, columnIndex, rowNumber);
        } //loop
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
                scrollIntoView(cell);
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
                if (event.altKey || event.CtrlKey) return;
                if (!cell.classList.contains(readonlyClassName)) {
                    if (characterInputCallback)
                        if (!characterInputCallback(cell, event))
                            return;
                    if (!autoCarriage) return;
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
