'use strict';

const {
    BrowserWindow, ipcMain, app
} = require('electron');
const path = require('path');
const url = require('url');
const _ = require('lodash');

//require('electron-debug')({showDevTools: true});

const {
    generateHash, onProgress
} = require('./../filesHashGenerator.js');

function create() {
    app.on('ready', () => {
        let mainWindow = new BrowserWindow({
            width: 800,
            height: 800
        });
        //mainWindow.maximize();

        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, "index.html"),
            protocol: 'file',
            slashs: true
        }));

        mainWindow.on('close', () => {
            mainWindow = null;
        });
    });
}


ipcMain.on('duplicate-finder', (event, args) => {
    var dir = _.first(args);

    onProgress(function (message) {
        event.sender.send('finder-progress', {
            type: 'progress',
            data: message
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

exports.create = create;
