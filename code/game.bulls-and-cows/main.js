/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

window.onload = () => {
  const tables = document.querySelectorAll("table");
  const cells = document.querySelectorAll("td");
  let index = 0;
  for (let table of tables) {
      table.tabIndex = index++;
      table.onclick = event => {
          event.target.classList.toggle("selected");
          const tableInstance = event.currentTarget;
          tableInstance.focus();
      };
      table.onkeydown = event => {
          const table = event.currentTarget;
          const row = table.rows[0];
          const cell = row.cells[0];
          if (event.key == "ArrowLeft") {
              console.log("r");
              cell.classList.toggle("selected");
          }
      };
  }
  for (let cell of cells) {
  }
  tables[1].focus();

}; //window.onload
