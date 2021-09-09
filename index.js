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

const LogLevel = {

	VERBOSE: new LogLevelModel('VERBOSE', 0),
	DEBUG: new LogLevelModel('DEBUG', 1),
	INFO: new LogLevelModel('INFO', 2),
	WARN: new LogLevelModel('WARN', 3),
	ERROR: new LogLevelModel('ERROR', 4),

};

class LoggerClient {

	/**
	 *
	 * @param {string} logSourceId
	 * @param {string} logSourceVersion
	 * @param {string} logSourceMode
	 * @param {string} defaultLogTag
	 * @param {LogLevelModel} minLogLevel
	 */
	constructor(logSourceId, logSourceVersion, logSourceMode, defaultLogTag, minLogLevel) {

		this._logSourceId = logSourceId;
		this._logSourceVersion = logSourceVersion;
		this._logSourceMode = logSourceMode;
		this._defaultLogTag = defaultLogTag;
		this._minLogLevel = minLogLevel;
	}

	/**
	 *
	 * @return {string}
	 */
	get logSourceId() {
		return this._logSourceId;
	}

	/**
	 *
	 * @return {string}
	 */
	get logSourceVersion() {
		return this._logSourceVersion;
	}

	/**
	 *
	 * @return {string}
	 */
	get logSourceMode() {
		return this._logSourceMode;
	}

	/**
	 *
	 * @return {string}
	 */
	get defaultLogTag() {
		return this._defaultLogTag;
	}

	/**
	 *
	 * @return {LogLevelModel}
	 */
	get minLogLevel() {
		return this._minLogLevel;
	}

	/**
	 *
	 * @param {string} TAG
	 * @param {string} message
	 * @param {Error} [error]
	 */
	v(TAG, message, error) {
		this.printLog(LogLevel.VERBOSE, TAG, message, error);
	}

	/**
	 *
	 * @param {string} TAG
	 * @param {string} message
	 * @param {Error} [error]
	 */
	d(TAG, message, error) {
		this.printLog(LogLevel.DEBUG, TAG, message, error);
	}

	/**
	 *
	 * @param {string} TAG
	 * @param {string} message
	 * @param {Error} [error]
	 */
	i(TAG, message, error) {
		this.printLog(LogLevel.INFO, TAG, message, error);
	}

	/**
	 *
	 * @param {string} TAG
	 * @param {string} message
	 * @param {Error} [error]
	 */
	w(TAG, message, error) {
		this.printLog(LogLevel.WARN, TAG, message, error);
	}

	/**
	 *
	 * @param {string} TAG
	 * @param {string} message
	 * @param {Error} [error]
	 */
	e(TAG, message, error) {
		this.printLog(LogLevel.ERROR, TAG, message, error);
	}

	/**
	 *
	 * @param {LogLevelModel} loglevel
	 * @param {string} TAG
	 * @param {string} message
	 * @param {Error} [error]
	 */
	printLog(loglevel, TAG, message, error) {

		if (loglevel.priority < this._minLogLevel.priority)
			return;

		if(typeof TAG !== 'string')
			TAG = this._defaultLogTag;

		if(typeof message !== 'string')
			message = JSON.stringify(message);

		if(error instanceof Error)
			error = `\nerrorMessage= ${error.message}\nerrorStack= ${error.stack}`;
		else if(typeof error !== 'string')
			error = JSON.stringify(error);


		switch (loglevel.priority) {

		case 0:
			console.log(`[${new Date().toISOString()}] / [${loglevel.name}] / [${TAG}]: ${message} <==ERROR==> ${error}`);
			break;
		case 1:
			console.debug(`[${new Date().toISOString()}] / [${loglevel.name}] / [${TAG}]: ${message} <==ERROR==> ${error}`);
			break;
		case 2:
			console.info(`[${new Date().toISOString()}] / [${loglevel.name}] / [${TAG}]: ${message} <==ERROR==> ${error}`);
			break;
		case 3:
			console.warn(`[${new Date().toISOString()}] / [${loglevel.name}] / [${TAG}]: ${message} <==ERROR==> ${error}`);
			break;
		case 4:
			console.error(`[${new Date().toISOString()}] / [${loglevel.name}] / [${TAG}]: ${message} <==ERROR==> ${error}`);
			break;

		}

	}

}


LoggerClient.Builder = function () {

	this.logSourceId = 'libloggerjs';
	this.logSourceVersion = '0.0.0';
	this.logSourceMode = 'debug';
	this.defaultLogTag = 'libloggerjs';
	this.minLogLevel = LogLevel.VERBOSE;

	return {
		/**
		 *
		 * @param {string} sourceId
		 * @return {LoggerClient.Builder}
		 */
		setSourceId: (sourceId) => {
			this.logSourceId = sourceId;
			return this;
		},
		/**
		 *
		 * @param {string} sourceVersion
		 * @return {LoggerClient.Builder}
		 */
		setSourceVersion: (sourceVersion) => {
			this.logSourceVersion = sourceVersion;
			return this;
		},
		/**
		 *
		 * @param {string} sourceMode
		 * @return {LoggerClient.Builder}
		 */
		setSourceMode: (sourceMode) => {
			this.logSourceMode = sourceMode;
			return this;
		},
		/**
		 *
		 * @param {string} logTag
		 * @return {LoggerClient.Builder}
		 */
		setDefaultLogTag: (logTag) => {
			this.defaultLogTag = logTag;
			return this;
		},
		/**
		 *
		 * @param {LogLevel.DEBUG|LogLevel.ERROR|LogLevel.INFO|LogLevel.WARN|LogLevel.VERBOSE} logLevel
		 * @return {LoggerClient.Builder}
		 */
		setMinLogLevel: (logLevel) => {
			this.minLogLevel = logLevel;
			return this;
		},
		build: () => {

		}
	};

};


module.exports = LoggerClient;
module.exports = LogLevel;
