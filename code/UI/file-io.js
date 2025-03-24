/*
File I/O
Copyright (c) 2017, 2025 by Sergey A Kryukov
http://www.SAKryukov.org
*/

"use strict";

const createFileIO = showException => {

    const experimentalImplementation = window.showOpenFilePicker && window.showSaveFilePicker;
    if (!experimentalImplementation)
        return undefined;

    let fileHandleSave = undefined;
    let fileHandleOpen = undefined;

    const exceptionHandler = exception => {
        if (showException != null &&
            //SA??? cannot see the other way to detect "The user aborted a request",
            // in contrast to "real" I/O error:
            !exception.message.toLowerCase().includes("user")) 
            showException(exception);
    }; //exceptionHandler

    const saveFileWithHandle = (handle, content) => {
        if (!handle) return;
        handle.createWritable().then(stream => {
            stream.write(content).then(() => {
                stream.close();
            }).catch(writeException => {
                exceptionHandler(writeException);
            });
        }).catch(createWritableException => {
            exceptionHandler(createWritableException);
        });
    }; //saveFileWithHandle

    const loadTextFile = (fileHandler, options) => { // fileHandler(fileName, text)
        options.startIn = fileHandleSave ?? fileHandleOpen;
        if (!fileHandler) return;
        window.showOpenFilePicker(options).then(handles => {
            if (!handles) return;
            if (!handles.length) return;
            fileHandleOpen = handles[0];
            handles[0].getFile().then(file => {
                file.text().then(text => {
                    fileHandler(handles[0].name, text);
                }).catch(fileTextException => {
                    exceptionHandler(fileTextException);
                });
            }).catch(getFileException => {
                exceptionHandler(getFileException);
            });
        }).catch(openFilePicketException => {
            exceptionHandler(openFilePicketException);
        });
    }; //loadTextFile

    const storeTextFile = (content, options) => {
        options.startIn = fileHandleSave ?? fileHandleOpen;
        window.showSaveFilePicker(options).then(handle => {
            if (!handle) return;
            fileHandleSave = handle;
            saveFileWithHandle(handle, content);
        }).catch(saveFilePickerException => {
            exceptionHandler(saveFilePickerException);
        });
    }; //storeTextFile

    return {
        storeTextFile: storeTextFile,
        loadTextFile: loadTextFile,
    };

}; //createFileIO
