/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const dictionaries = { "English": English, "Russian": Russian };

const performAdHocDictionaryMainenance = () => {

    const compactMode = true;

    const spacer = compactMode ? null : "  ";

    const wrap = (languageName, json) =>
       `"use strict";\nconst ${languageName} =\n${json};`;
    
    const dictionaryMaintenance = (languageName, newWords) => {
        for (let word of newWords)
            dictionaries[languageName].alphabetical[word] = word.length;
        dictionaries[languageName].indexedByLength = {};
        let array = [];
        for (let index in dictionaries[languageName].alphabetical)
            array.push(index);
        array.sort();
        dictionaries[languageName].alphabetical = {};
        for (let word of array)
            dictionaries[languageName].alphabetical[word] = word.length;
        // indexing:
        for (let index = 0; index < array.length; ++index) {
            const word = array[index];
            if (dictionaries[languageName].indexedByLength[word.length] == null)
                dictionaries[languageName].indexedByLength[word.length] = [];
            dictionaries[languageName].indexedByLength[word.length].push(index);
        } //loop
        //
        const json = JSON.stringify(dictionaries[languageName], null, spacer);
        navigator.clipboard.writeText(wrap(languageName, json));
    }; //dictionaryMaintenance

    const transform = languageName => {
        const json = JSON.stringify(dictionaries[languageName], null, spacer);
        navigator.clipboard.writeText(wrap(languageName, json));
    }; //transform

    //dictionaryMaintenance("Russian", ["пита","кепи","шаурма","шаверма","оммаж","фуа","маракуйя","гранадилла","арахнофобия","арахнофоб","неолиберал","неолиберализм","неоконсерватор","неоконсерватизм","терапсид","горгонопс","алкен","алкин","криогений","тоний","мира","пескоструйщица","катык","сузьма","курт","кевлар","сарт","килт","икта","спарка","парка"]);
    dictionaryMaintenance("English", []);
    //transform("English");

}; //performAdHocDictionaryMainenance
