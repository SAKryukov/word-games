/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const setupMenuActivator = (contextMenu, buttonActivateMenu) => {

    let lastPointerX = 0;
    let lastPointerY = 0;
    window.onpointermove = event => {
        lastPointerX = event.clientX;
        lastPointerY = event.clientY;
    }; //window.onpointermove
    window.oncontextmenu = event => {
        contextMenu.activate(lastPointerX, lastPointerY);
        event.preventDefault();
    }; //window.oncontextmenu
    buttonActivateMenu.onclick = event => {
        const rectangle = event.target.getBoundingClientRect();
        contextMenu.activate((rectangle.left + rectangle.right) / 2, rectangle.bottom);
    }; 

};
