"use strict";

const electron = require("electron");
const path = require("path");
const windows = require("./modules/windows");
const alert = require("./modules/alert");

electron.app.on("ready", () => {
	windows.new({width: 1600, height: 300, page: path.join(__dirname, "swarm.html")});
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
					label: "About",
					click: () => {
						alert("This is a test program running under Electron " + process.versions.electron);
					}
				},
				{
					type: "separator"
				},
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
					role: "reload"
				},
				{
					role: "quit"
				},
				{
					type: "separator"
				},
				{
					role: "toggledevtools"
				}
			]
		}
	];

	const menu = electron.Menu.buildFromTemplate(template);
	electron.Menu.setApplicationMenu(menu);
}
