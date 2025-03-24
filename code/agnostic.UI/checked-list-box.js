/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const setupCheckedListBox = (selectElement, defaultValues, modificationCallback) => {
    // modificationCallback(number index, string textContent, bool value)

    const emptyBallotPrefix = `${String.fromCodePoint(0x2610)} `;
    const checkedBallotPrefix = `${String.fromCodePoint(0x2611)} `;
    const valueTrue = true.toString();
    const blankSpace = " ";
    const originalTextContent = [];

    const toggleOption = (option, index) => {
        const value = !(option.value == valueTrue);
        option.value = value;
        if (value)
            option.textContent = checkedBallotPrefix + originalTextContent[index];
        else
            option.textContent = emptyBallotPrefix + originalTextContent[index];
        if (callback) callback(getValues()); //SA??? obsolete
        if (modificationCallback)
            modificationCallback(index, originalTextContent[index], value);
    }; //toggleOption

    for (let index = 0; index < selectElement.childElementCount; ++index) {
        const option = selectElement.children[index];
        const value = !!defaultValues[index];
        originalTextContent.push(option.textContent);
        if (value)
            option.textContent = checkedBallotPrefix + originalTextContent[index];
        else
            option.textContent = emptyBallotPrefix + originalTextContent[index];
        option.value = value;
        option.ondblclick = event =>
            toggleOption(event.target, event.target.parentElement.selectedIndex);
    } //loop

    const handleToggle = event => {
        if (event.key == blankSpace) {
            const option = event.target.children[event.target.selectedIndex];
            toggleOption(option, event.target.selectedIndex);
        } //if
    };
    selectElement.onkeyup = event => handleToggle(event);

    const getValues = () => {
        const values = [];
        for (let index = 0; index < selectElement.childElementCount; ++index) {
            const option = selectElement.children[index];
            const value = option.value == valueTrue;
            values.push(value);
        } //loop
        return values;
    };

    const setValues = values => {
        for (let index = 0; index < selectElement.childElementCount; ++index) {
            const option = selectElement.children[index];
            option.value = values[index];
            if (values[index])
                option.textContent = checkedBallotPrefix + originalTextContent[index];
            else
                option.textContent = emptyBallotPrefix + originalTextContent[index];
            } //loop
            if (callback) callback(getValues()); //SA??? obsolete
            if (modificationCallback)
                modificationCallback(index, originalTextContent[index], values[index]);
    } //setValues

    let callback; //SA??? obsolete

    const setCallback = aCallback => callback = aCallback; //SA??? obsolete

    return {
        setCallback: setCallback, //SA??? obsolete
        getValues: getValues, setValues: setValues };

};