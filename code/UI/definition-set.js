/*
  Word games
  Copyright (c) 2025 by Sergey A Kryukov
  http://www.SAKryukov.org
  https://github.com/SAKryukov/word-games
*/

"use strict";

const getIoDefinitionSet = () => {
    const ioDefinitionSet = {};

    ioDefinitionSet.createFileOptions = (suggestedName, gameName) => {
        return {
            suggestedName: suggestedName,
            types: [
                {
                    description: `JSON file or ${gameName} file`,
                    accept: { "application/ecmascript": [".words", ".json"] },
                }
            ]
        };
    }; //definitionSet.createFileOptions

    function InvalidFileTypeError(message = "") {
        this.name = "Invalid file type error";
        this.message = message;
    } //InvalidFileTypeError
    InvalidFileTypeError.prototype = Error.prototype;

    ioDefinitionSet.IOErrorFormat = {
        formatException: exception => `<p>${exception.name}<br/><br/>${exception.message}</p>`,
        modalPopupOptions: {
            textAlign: "center",
            textLineColor: { message: "red", },
            backgroundColor: { message: "lightYellow", },
        },
        invalidSignatureMessage: signature => `Invalid file signature: ${signature}`,
        invalidFileTypeError: InvalidFileTypeError,
    }; //ioDefinitionSet.IOErrorFormat

    return ioDefinitionSet;
};

