/*
File I/O
Copyright (c) 2017, 2025 by Sergey A Kryukov
http://www.SAKryukov.org
*/

"use strict";

const createFileIO = showException => {

    const experimentalImplementation = window.showOpenFilePicker && window.showSaveFilePicker;

    let fileHandleSave = undefined;
    let fileHandleOpen = undefined;
    let previouslyOpenedFilename = null; // fallback

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
        options.startIn = fileHandleSave ?? fileHandleOpen ?? "downloads";
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

    const storeTextFile = (_, content, options) => {
        options.startIn = fileHandleSave ?? fileHandleOpen;
        window.showSaveFilePicker(options).then(handle => {
            if (!handle) return;
            fileHandleSave = handle;
            saveFileWithHandle(handle, content);
        }).catch(saveFilePickerException => {
            exceptionHandler(saveFilePickerException);
        });
    }; //storeTextFile

    const storeTextFileFallback = (fileName, content, _) => {
        const link = document.createElement('a');
        link.href = `data:application/javascript;charset=utf-8,${encodeURIComponent(content)}`; //sic!
        link.download = this.previouslyOpenedFilename == null
            ? fileName
            : this.previouslyOpenedFilename;
        link.click();
    }; //storeTextFileFallback

    const loadTextFileFallback = (fileHandler, fileType) => { // fileHandler(fileName, text)
        if (!fileHandler) return;
        const input = document.createElement("input");
        input.type = "file";
        let acceptFileTypes = null;
        for (let index in fileType.accept) {
            acceptFileTypes = fileType.accept[index][0];
            break;
        } //loop
        input.accept = acceptFileTypes;
        input.value = null;
        if (fileHandler)
            input.onchange = event => {
                const file = event.target.files[0];
                previouslyOpenedFilename = file.name;
                if (!file) return;
                const reader = new FileReader();
                reader.readAsText(file);
                reader.onload = readEvent => fileHandler(file.name, readEvent.target.result);
            }; //input.onchange
        input.click();
    }; //loadTextFileFallback

    return {
        isFallback: !experimentalImplementation,
        storeTextFile: experimentalImplementation ? storeTextFile : storeTextFileFallback,
        loadTextFile: experimentalImplementation ? loadTextFile : loadTextFileFallback,
    };

}; //createFileIO
