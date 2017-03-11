"use strict";

const electron = require("electron");

exports.alert = (msg) => {
    electron.dialog.showMessageBox({
        message: msg,
        title: "Alert!",
        buttons: ["OK"]
    });
}
