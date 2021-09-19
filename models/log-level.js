'use strict';

class LogLevelModel {

	/**
	 *
	 * @param {string} name
	 * @param {number} priority
	 */
	constructor(name, priority) {
		this._name = name;
		this._priority = priority;
	}

	/**
	 *
	 * @return {string}
	 */
	get name() {
		return this._name;
	}

	/**
	 *
	 * @return {number}
	 */
	get priority() {
		return this._priority;
	}

}

module.exports.LogLevelModel = LogLevelModel;

module.exports.LogLevel = {

	VERBOSE: new LogLevelModel('VERBOSE', 0),
	DEBUG: new LogLevelModel('DEBUG', 1),
	INFO: new LogLevelModel('INFO', 2),
	WARN: new LogLevelModel('WARN', 3),
	ERROR: new LogLevelModel('ERROR', 4),

};
