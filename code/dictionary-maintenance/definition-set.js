/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const getMaintenanceDefinitionSet = () => {
    
    const maintenanceDefinitionSet = {
        resultHTML: "<p>Dictionary maitenance complete.</p><p>The resulting dictionary definition is in the clipboard.</p>",
        resultDimmerOpacity: 0.3,
		codeWrap: (languageName, json) =>
            `"use strict";\nconst ${languageName} =\n${json};`,
        lexicalSet: {
            delimiter: ",",
            keyValuePair: (key, value) => `${key}:${value}`,
            objectWrapper: properties => `{${properties}}`,
        },
        outputDelimiter: ", ",
        visibility: {
            shown: "block",
            hidden: "none"
        },
    };

    return maintenanceDefinitionSet;
};
