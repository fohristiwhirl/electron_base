"use strict";

const alert = require("./modules/alert");
const electron = require("electron");
const ipcMain = require("electron").ipcMain;
const path = require("path");
const url = require("url");

let menu = menu_build();
let win;						// We're supposed to keep global references to every window we make.

electron.app.on("ready", () => {

	win = new electron.BrowserWindow({
		width: 1600,
		height: 300,
		backgroundColor: "#000000",
		resizable: true,
		show: false,			// We won't show until it's properly drawn.
		useContentSize: true,
		webPreferences: {
			backgroundThrottling: false,
			nodeIntegration: true,
			zoomFactor: 1 / electron.screen.getPrimaryDisplay().scaleFactor
		}
	});

	let pagepath = path.join(__dirname, "swarm.html");

	win.loadURL(url.format({
		protocol: "file:",
		pathname: pagepath,
		slashes: true
	}));

	win.once("ready-to-show", () => {		// Thankfully, fires even after exception during renderer startup.
		win.show();
		win.focus();
	});

	electron.Menu.setApplicationMenu(menu);
});

// See Fluorine or Nibbler for examples of loading a file from command line argument.
// Note that "ready-to-show" probably fires too early to use as a trigger for that.

electron.app.on("window-all-closed", () => {
	electron.app.quit();
});

function menu_build() {
	const template = [
		{
			label: "Menu",
			submenu: [
				{
					label: "About",
					click: () => {
						alert("This is a test program running under Electron " + process.versions.electron);
					}
				},
				{
					role: "quit"
				},
				{
					role: "toggledevtools"
				}
			]
		}
	];

	return electron.Menu.buildFromTemplate(template);
}
