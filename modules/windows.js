"use strict";

const electron = require("electron");
const url = require("url");

const all = [];

exports.new = (width, height, protocol, page) => {

    let win = new electron.BrowserWindow({
        width: width,
        height: height,
        backgroundColor: "#000000",
        useContentSize: true,
        webPreferences: { zoomFactor: 1 / electron.screen.getPrimaryDisplay().scaleFactor }     // The screen may be zoomed, we can compensate.
    });

    win.loadURL(url.format({
        protocol: protocol,
        pathname: page,
        slashes: true
    }));

    all.push(win);

    win.on("closed", () => {
        let n;
        for (n = 0; n < all.length; n += 1) {
            if (all[n] === win) {
                all.splice(n, 1);
                break;
            }
        }
    });
};

exports.change_zoom = (diff) => {
    let n;
    for (n = 0; n < all.length; n += 1) {
        let contents = all[n].webContents;
        contents.getZoomFactor((val) => {
            contents.setZoomFactor(val + diff);
        });
    }
};

exports.set_zoom = (val) => {
    let n;
    for (n = 0; n < all.length; n += 1) {
        let contents = all[n].webContents;
        contents.setZoomFactor(val);
    }
};
