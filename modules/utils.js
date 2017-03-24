"use strict";

exports.make = (base, params) => {
    return Object.assign(Object.create(base), params);
}

exports.assign_without_overwrite = (target, source) => {
	if (source === undefined) {
		return;
	}
	let keys = Object.keys(source)
    for (let key in keys) {
        if (target.hasOwnProperty(key) === false) {
            target[key] = source[key];
        }
    }
}
