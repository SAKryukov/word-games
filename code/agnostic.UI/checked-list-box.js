/*
  Checked list box
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const setupCheckedListBox = (selectElement, defaultValues, modificationCallback) => {
    // modificationCallback(number index, string textContent, bool value, bool initial)

    const definitionSet = {
        emptyBallotPrefix: `${String.fromCodePoint(0x2610)} `,
        checkedBallotPrefix: `${String.fromCodePoint(0x2611)} `,
        keyToogleFlipCheck: new Set(["Space", "Enter"]),
    }; //definitionSet

    const optionMap = new Map();
    const optionIndex = [];

    const setOption = (option, mapValue, initial) => {
        if (mapValue.value)
            option.textContent = definitionSet.checkedBallotPrefix + mapValue.textContent;
        else
            option.textContent = definitionSet.emptyBallotPrefix + mapValue.textContent;
        if (modificationCallback)
            modificationCallback(mapValue.index, mapValue.textContent, mapValue.value, initial);
    }; //setOption

    const toggleOption = option => {
        const mapValue = optionMap.get(option);
        mapValue.value = !mapValue.value;
        setOption(option, mapValue);
    }; //toggleOption

    for (let index = 0; index < selectElement.childElementCount; ++index) {
        const option = selectElement.children[index];
        const value = !!defaultValues[index];
        const mapValue = { value: value, index: index, textContent: option.textContent };
        optionMap.set(option, mapValue);
        optionIndex.push(option);
        const initial = true;
        setOption(option, mapValue, initial);
        option.ondblclick = event =>
            toggleOption(event.target);
    } //loop

    selectElement.onkeyup = event => {
        if (definitionSet.keyToogleFlipCheck.has(event.code)) {
            const option = event.target.children[event.target.selectedIndex];
            toggleOption(option);
        } //if
    }; //selectElement.onkeyup

    const getValue = index =>
        optionMap.get(optionIndex[index]).value;

    const setValue = (index, value) => {
        const option = optionIndex[index];
        const mapValue = optionMap.get(option);
        mapValue.value = value;
        setOption(option, mapValue);
    } //setValue

    return { getValue: getValue, setValue: setValue };

};
