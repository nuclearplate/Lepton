'use strict';

var app = require('app');
var ipc = require('ipc');
var env = require('./vendor/electron_boilerplate/env_config');
var Menu = require('menu');
var dialog = require("dialog");
var MenuItem = require('menu-item');
var devHelper = require('./vendor/electron_boilerplate/dev_helper');
var BrowserWindow = require('browser-window');
var windowStateKeeper = require('./vendor/electron_boilerplate/window_state');

var mainWindow;

// Preserver of the window size and position between app launches.
var mainWindowState = windowStateKeeper('main', {
    width: 1000,
    height: 600
});

app.on('ready', function () {

    mainWindow = new BrowserWindow({
      x: mainWindowState.x,
      y: mainWindowState.y,
      width: mainWindowState.width,
      height: mainWindowState.height
    });

    if(mainWindowState.isMaximized) {
      mainWindow.maximize();
    }

    mainWindow.loadUrl('file://' + __dirname + '/app.html');

    if(env.name === 'development') {
      devHelper.setDevMenu();
      mainWindow.openDevTools();
    }

    mainWindow.on('close', function () {
      mainWindowState.saveState(mainWindow);
    });

    ipc.on('new', function(data) {
      dialog.showSaveDialog(mainWindow, {}, function(path) {
        console.log("CALLBACK", path);
        mainWindow.webContents.send('newFile', path);
      });
    });

    ipc.on('requestReset', function() {
      mainWindow.webContents.send('reset');
      BrowserWindow.getFocusedWindow().reloadIgnoringCache();
    });

    // Create the Application's main menu
    var template = [{
      label: 'Lepton',
      submenu: [
        {
          label: 'About Lepton',
          selector: 'orderFrontStandardAboutPanel:'
        },
        {
          type: 'separator'
        },
        {
          label: 'Services',
          label: 'Services',
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          label: 'Hide Lepton',
          accelerator: 'Command+H',
          selector: 'hide:'
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:'
        },
        {
          label: 'Show All',
          selector: 'unhideAllApplications:'
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: function() { app.quit(); }
        },
      ]
    },
    {
      label: 'File',
      submenu: [
        {
          label: 'New',
          accelerator: 'Command+N',
          click: function() { 
            dialog.showSaveDialog(mainWindow, {}, function(path) {
              mainWindow.webContents.send('createFile', path);
            });
          }
        },
        {
          label: 'Save',
          accelerator: 'Command+S',
          click: function() { 
            mainWindow.webContents.send('save');
          }
        },
        {
          label: 'Open',
          accelerator: 'Command+O',
          click: function() { 
            dialog.showOpenDialog(mainWindow, {}, function(path) {
              if(path !== undefined && path !== '' && path !== null) {
                mainWindow.webContents.send('open', path);
              }
            });
          }
        },
        {
          label: "Reset all (can't undo)",
          click: function() {
            mainWindow.webContents.send('reset');
            BrowserWindow.getFocusedWindow().reloadIgnoringCache();
          }
        },
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'Command+Z',
          selector: 'undo:'
        },
        {
          label: 'Redo',
          accelerator: 'Shift+Command+Z',
          selector: 'redo:'
        },
        {
          type: 'separator'
        },
        {
          label: 'Cut',
          accelerator: 'Command+X',
          selector: 'cut:'
        },
        {
          label: 'Copy',
          accelerator: 'Command+C',
          selector: 'copy:'
        },
        {
          label: 'Paste',
          accelerator: 'Command+V',
          selector: 'paste:'
        },
        {
          label: 'Select All',
          accelerator: 'Command+A',
          selector: 'selectAll:'
        },
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click: function() { BrowserWindow.getFocusedWindow().reloadIgnoringCache(); }
        },
        {
          label: 'Toggle DevTools',
          accelerator: 'Alt+Command+J',
          click: function() { BrowserWindow.getFocusedWindow().toggleDevTools(); }
        },
      ]
    },
    {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:'
        },
        {
          label: 'Close',
          accelerator: 'Command+W',
          selector: 'performClose:'
        },
        {
          type: 'separator'
        },
        {
          label: 'Bring All to Front',
          selector: 'arrangeInFront:'
        },
      ]
    },
    {
      label: 'Help',
      submenu: []
    }];
  
    var menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
});

app.on('window-all-closed', function () {
    app.quit();
});
