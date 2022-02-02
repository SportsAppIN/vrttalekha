'use strict';

class LogLevel {

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

module.exports.LogLevel = LogLevel;

module.exports.VERBOSE= new LogLevel('VERBOSE', 0);
module.exports.DEBUG= new LogLevel('DEBUG', 1);
module.exports.INFO= new LogLevel('INFO', 2);
module.exports.WARN= new LogLevel('WARN', 3);
module.exports.ERROR= new LogLevel('ERROR', 4);
