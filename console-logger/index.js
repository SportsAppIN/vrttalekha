'use strict';

const {LogLevelModel, LogLevel} = require('../models/log-level');

class ConsoleLogger {

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
		this._sanitizeLog(
			LogLevel.VERBOSE,
			TAG,
			message,
			error,
			(canPublishLogs, logLevel, TAG1, message1, error1) => {
				if(canPublishLogs) {
					this._printLog(logLevel, TAG1, message1, error1);
				}
			});
	}

	/**
	 *
	 * @param {string} TAG
	 * @param {string} message
	 * @param {Error} [error]
	 */
	d(TAG, message, error) {
		this._sanitizeLog(
			LogLevel.DEBUG,
			TAG,
			message,
			error,
			(canPublishLogs, logLevel, TAG1, message1, error1) => {
				if(canPublishLogs) {
					this._printLog(logLevel, TAG1, message1, error1);
				}
			});
	}

	/**
	 *
	 * @param {string} TAG
	 * @param {string} message
	 * @param {Error} [error]
	 */
	i(TAG, message, error) {
		this._sanitizeLog(
			LogLevel.INFO,
			TAG,
			message,
			error,
			(canPublishLogs, logLevel, TAG1, message1, error1) => {
				if(canPublishLogs) {
					this._printLog(logLevel, TAG1, message1, error1);
				}
			});
	}

	/**
	 *
	 * @param {string} TAG
	 * @param {string} message
	 * @param {Error} [error]
	 */
	w(TAG, message, error) {
		this._sanitizeLog(
			LogLevel.WARN,
			TAG,
			message,
			error,
			(canPublishLogs, logLevel, TAG1, message1, error1) => {
				if(canPublishLogs) {
					this._printLog(logLevel, TAG1, message1, error1);
				}
			});
	}

	/**
	 *
	 * @param {string} TAG
	 * @param {string} message
	 * @param {Error} [error]
	 */
	e(TAG, message, error) {
		this._sanitizeLog(
			LogLevel.ERROR,
			TAG,
			message,
			error,
			(canPublishLogs, logLevel, TAG1, message1, error1) => {
				if(canPublishLogs) {
					this._printLog(logLevel, TAG1, message1, error1);
				}
			});
	}

	/**
	 *
	 * @param {LogLevelModel} logLevel
	 * @param {string} TAG
	 * @param {string} message
	 * @param {Error} error
	 * @param { function(canPublishLogs:boolean, logLevel:LogLevelModel|null, TAG:string|null, message:string|null, error:string|null):void } callback
	 *
	 * @protected
	 *
	 */
	_sanitizeLog(logLevel, TAG, message, error, callback) {

		if(logLevel.priority < this._minLogLevel.priority) {
			callback(false, null, null, null, null);
			return;
		}

		if(typeof TAG !== 'string')
			TAG = this._defaultLogTag;
		else
			TAG = TAG.toLowerCase();

		if(typeof message !== 'string')
			message = JSON.stringify(message);

		if(error instanceof Error)
			error = `\nerrorMessage= ${error.message}\nerrorStack= ${error.stack}`;
		else if(typeof error !== 'string')
			error = JSON.stringify(error);
		else
			error = null;

		callback(true, logLevel, TAG, message, error);

	}

	/**
	 *
	 * @param {LogLevelModel} loglevel
	 * @param {string} TAG
	 * @param {string} message
	 * @param {string} error
	 *
	 *
	 * @protected
	 *
	 */
	_printLog(loglevel, TAG, message, error) {

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

ConsoleLogger.Builder = class {

	constructor() {
		this._logSourceId = 'libloggerjs';
		this._logSourceVersion = '2021.9.2';
		this._logSourceMode = 'debug';
		this._defaultLogTag = 'libloggerjs';
		this._minLogLevel = LogLevel.VERBOSE;
	}

	/**
	 *
	 * @param {string} sourceId
	 * @return {ConsoleLogger.Builder}
	 */
	setLogSourceId(sourceId) {
		if(typeof sourceId !== 'string')
			throw new Error('logSourceId must be a string');
		this._logSourceId = sourceId.toLowerCase();
		return this;
	}

	/**
	 *
	 * @param {string} sourceVersion
	 * @return {ConsoleLogger.Builder}
	 */
	setLogSourceVersion(sourceVersion) {
		if(typeof sourceVersion !== 'string')
			throw new Error('sourceVersion must be a string');
		this._logSourceVersion = sourceVersion.toLowerCase();
		return this;
	}

	/**
	 *
	 * @param {string} sourceMode
	 * @return {ConsoleLogger.Builder}
	 */
	setLogSourceMode(sourceMode) {
		if(typeof sourceMode !== 'string')
			throw new Error('sourceMode must be a string');
		this._logSourceMode = sourceMode.toLowerCase();
		return this;
	}

	/**
	 *
	 * @param {string} logTag
	 * @return {ConsoleLogger.Builder}
	 */
	setDefaultLogTag(logTag) {
		if(typeof logTag !== 'string')
			throw new Error('logTag must be a string');
		this._defaultLogTag = logTag.toLowerCase();
		return this;
	}

	/**
	 *
	 * @param {LogLevelModel} minLogLevel
	 * @return {ConsoleLogger.Builder}
	 */
	setMinLogLevel(minLogLevel) {
		if (!(minLogLevel instanceof LogLevelModel))
			throw new Error('minLogLevel must be an instance of LogLevelModel');
		this._minLogLevel = minLogLevel;
		return this;
	}

	/**
	 *
	 * @return {ConsoleLogger}
	 */
	build() {
		return new ConsoleLogger(
			this._logSourceId,
			this._logSourceVersion,
			this._logSourceMode,
			this._defaultLogTag,
			this._minLogLevel
		);
	}

};

module.exports = ConsoleLogger;
