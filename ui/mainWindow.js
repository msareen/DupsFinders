const electron = require('electron');
const path = require('path');
const url = require('url');
const BrowserWindow = electron.BrowserWindow;

function create() {
    let app = electron.app;
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

exports.create = create;
