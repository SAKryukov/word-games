/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

window.onload = () => {

	const stringify = anObject => {
		if (anObject instanceof Array) {
			const elements = [];
			for (let element of anObject)
				elements.push(stringify(element));
			return `[${elements.join(",")}]`;
		} else if (anObject instanceof Object) {
			const wrapKey = key =>
				key.indexOf(' ') < 0
					? key
					: `"${key}"`;
			let properties = Object.keys(anObject)
				.map(key => `${wrapKey(key)}:${stringify(anObject[key])}`)
			return `{${properties}}`;
		} else
			return JSON.stringify(anObject);
	}; //stringify

	const elementSet = getElementSet(null);
	const languageSelector =
		createLanguageSelector(elementSet.input.languageSet, null, null, null);

	const dictionaryMainenance = () => {
		const removedWords = [];
		const notRemovedWords = [];
		const addedWords = [];
		const badWords = [];
		const alreadyAdded = [];
		const goodWord = (word, dictionary) => {
			for (let index = 0; index < word.length; ++index)
				if (dictionary.characterRepertoire.characters.indexOf(word[index]) < 0)
					return false
			return true;
		}; //goodWord
		const removeAddWords = (wordsToRemove, wordsToAdd) => {
			const dictionary = structuredClone(languageSelector.currentLanguage);
			const wordSet = new Set(dictionary.alphabetical);
			if (wordsToRemove != null)
				for (let word of wordsToRemove) {
					word = word.toLowerCase();
			        if (wordSet.has(word)) {
						wordSet.delete(word);
						removedWords.push(word);
					} else
						notRemovedWords.push(word);
				} //loop
			if (wordsToAdd != null)
				for (let word of wordsToAdd) {
					word = word.toLowerCase();
					if (wordSet.has(word)) {
						alreadyAdded.push(word);
						continue;
					} //if
					if (goodWord(word, dictionary)) {
						wordSet.add(word);
						addedWords.push(word);
					} else
						badWords.push(word);
				} //loop
			const array = [];
			wordSet.forEach(word => array.push(word));
			array.sort();
			dictionary.alphabetical = array;
			dictionary.indexedByLength = {};
			for (let index = 0; index < array.length; ++index) {
				const word = array[index];
				if (dictionary.indexedByLength[word.length] == null)
					dictionary.indexedByLength[word.length] = [];
				dictionary.indexedByLength[word.length].push(index);
			} //loop
			const json = stringify(dictionary);
			navigator.clipboard.writeText(maintenance.definitionSet.codeWrap(json));
		}; //removeAddWords
		const getWords = value => {
			const result = [];
			const words = value.split(maintenance.definitionSet.lexicalSet.delimiter);
			for (let word of words) {
				const testWord = word.trim();
				if (testWord.length > 0)
					result.push(testWord);
			} //loop
			return result;
		}; //getWords
	    removeAddWords(
			getWords(elementSet.input.wordsToRemove.value),
			getWords(elementSet.input.wordsToAdd.value)
		);
		const showResult = (parent, input, value) => {
			parent.style.display = 
				value != null && value.length > 0
					? maintenance.definitionSet.visibility.shown
					: maintenance.definitionSet.visibility.hidden;
			input.value = value.join(maintenance.definitionSet.outputDelimiter);
		};
		showResult(elementSet.output.containerRemovedWords, elementSet.output.valueRemovedWords, removedWords);
		showResult(elementSet.output.containerNotRemovedWords, elementSet.output.valueNotRemovedWords, notRemovedWords);
		showResult(elementSet.output.containerAddedWords, elementSet.output.valueAddedWords, addedWords);
		showResult(elementSet.output.containerBadWords, elementSet.output.valueBadWords, badWords);
		showResult(elementSet.output.containerAlreadyAddedWords, elementSet.output.valueAlreadyAddedWords, alreadyAdded);
	}; //dictionaryMainenance

	elementSet.input.buttonStart.onclick = () => {
		dictionaryMainenance();
		modalPopup.show(
			maintenance.definitionSet.resultHTML,
			null,
			{dimmerOpacity: maintenance.definitionSet.resultDimmerOpacity});
	}; //elementSet.input.buttonStart.onclick

}; //window.onload
