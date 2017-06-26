'use strict';

const {
    BrowserWindow, ipcMain, app
} = require('electron');
const path = require('path');
const url = require('url');
const _ = require('lodash');


const {
    generateHash, onProgress, cancelProgress
} = require('./../filesHashGenerator.js');

let mainWindow = null;

function create() {
    app.on('ready', () => {
        mainWindow = new BrowserWindow({
            width: 800,
            height: 800,
            title: "Duplicate File Finder"
        });

        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, "index.html"),
            protocol: 'file',
            slashs: true
        }));

        mainWindow.on('close', () => {
            mainWindow = null;
        });
    });

    app.on('window-all-closed', app.quit);
}


ipcMain.on('dupsFinder-find', (event, args) => {
    var dir = _.first(args);

    onProgress(function (progressObj) {
        mainWindow.setTitle('Dups Finder - ' + progressObj.message);
        event.sender.send('finder-progress', {
            type: 'progress',
            data: progressObj
        });
    })

    generateHash(dir)
        .then((results) => {
            event.sender.send('finder-progress', {
                type: 'result',
                data: results
            });
        })
        .catch((err) => {
            event.sender.send('finder-progress', {
                type: 'error',
                data: err
            });
        });
})

ipcMain.on('dupsFinder-cancel', (event, args) => {
    cancelProgress();
})

exports.create = create;
