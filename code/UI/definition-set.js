/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const games = namespaces.create({
    definitionSet: {

        tooltip: {
            elementTag: "div",
            cssClass: "tooltip",
            showTime: 7000, // 7sec
            isPriorityVertical: true,
            // usage: data-vertical-tooltip="false", or false, or absent (default):
            verticalPriorityDataSetName: "verticalTooltip", 
        }, //tooltip 

    }, //definitionSet
}); //IO.definitionSet
