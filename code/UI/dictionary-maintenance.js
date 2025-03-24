/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const createDictionaryMaintenanceStarter = gameDefinitionSet => {
    const dictionaryMaintenanceStarter = {};

    let menuItemText = null;

    dictionaryMaintenanceStarter.prepareMenu = menuElement => {
        const url = new URLSearchParams(document.location.search);
        if (url.get(gameDefinitionSet.dictionaryMaintenance.urlKeyword) != null) {
            menuItemText = gameDefinitionSet.dictionaryMaintenance.menuItemText;
            const maintenance = gameDefinitionSet.dictionaryMaintenance.createOption();
            maintenance.textContent = menuItemText;
            menuElement.appendChild(maintenance);
        } //if maintenance
    }; //dictionaryMaintenanceStarter.prepareMenu

    dictionaryMaintenanceStarter.subsribe = menu => {
        if (menuItemText) {
            menu.subscribe(menuItemText, actionRequest => {
                if (!actionRequest) return true;
                performAdHocDictionaryMainenance();
                modalPopup.show(
                    gameDefinitionSet.dictionaryMaintenance.maitenanceCompletionMessage());
            });
        } //if maintenance
    }; //dictionaryMaintenanceStarter.subsribe

    return dictionaryMaintenanceStarter;
};
