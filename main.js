"use strict";

const electron = require("electron");
const windows = require("./modules/windows");
const alert = require("./modules/alert");

electron.app.on("ready", () => {
    windows.new({width: 1600, height: 300, page: "swarm.html"});
    menu_build();
});

electron.app.on("window-all-closed", () => {
    electron.app.quit();
});

function menu_build() {
    const template = [
        {
            label: "Menu",
            submenu: [
                {
                    label: "Zoom out",
                    click: () => {
                        windows.change_zoom(-0.1);
                    }
                },
                {
                    label: "Zoom in",
                    click: () => {
                        windows.change_zoom(0.1);
                    }
                },
                {
                    label: "About",
                    click: () => {
                        alert.alert("This is a test program.");
                    }
                }
            ]
        }
    ];

    const menu = electron.Menu.buildFromTemplate(template);
    electron.Menu.setApplicationMenu(menu);
}
