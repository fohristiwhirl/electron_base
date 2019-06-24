"use strict";

// Returns the path of the main folder, for some idiosyncratic definition of main folder.
// Probably shouldn't ever use this for anything.

const path = require("path");
const running_as_electron = require("./running_as_electron");

module.exports = () => {
	if (running_as_electron()) {
		return path.join(__dirname, "..");		// Return the dir one level above this .js file
	}
	return path.dirname(process.argv[0]);		// Return the location of the prebuilt .exe
}
