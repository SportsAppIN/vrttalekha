'use strict';

const EventEmitter = require('events');
const {LogLevel, VERBOSE, DEBUG, ERROR, INFO, WARN} = require('../log-level');

class ConsoleLogger extends EventEmitter {

	/**
	 *
	 * @param {string} _sourceId
	 * @param {string} _sourceVersion
	 * @param {string} _sourceMode
	 * @param {LogLevel} _minLogLevel
	 */
	constructor(_sourceId, _sourceVersion, _sourceMode, _minLogLevel) {
		super();
		this._sourceId = _sourceId;
		this._sourceVersion = _sourceVersion;
		this._sourceMode = _sourceMode;
		this._minLogLevel = _minLogLevel;
	}

	/**
	 *
	 * @param {string} tag
	 * @param {string} message
	 * @private
	 */
	_validate(tag, message) {
		if(typeof tag !== 'string')
			throw new Error('tag must be a string');
		if(typeof message !== 'string')
			throw new Error('message must be a string');
	}

	/**
	 *
	 * @param {LogLevel} logLevel
	 * @param {string} tag
	 * @param {string} message
	 * @param {any} error
	 * @return {{sourceId: string, logTag: string, logTimestamp: Date, sourceMode: string, logLevel: string, sourceVersion: string, logPriority: number, logMessage: string, error: any}}
	 * @private
	 */
	_prepareLogObject(logLevel, tag, message, error) {
		this._validate(tag, message);

		try {
			if(error === undefined || error === null)
				error = null;
			else if(error instanceof Error)
				error = error.stack;
			else
				error = JSON.stringify(error);
		} catch (_e) {
			error = _e.stack;
		}


		return {
			sourceId: this._sourceId,
			sourceVersion: this._sourceVersion,
			sourceMode: this._sourceMode,
			logLevel: logLevel.name,
			logPriority: logLevel.priority,
			logTag: tag,
			logMessage: message,
			error: error,
			logTimestamp: new Date()
		};
	}

	/**
	 *
	 * @param {{sourceId: string, logTag: string, logTimestamp: Date, sourceMode: string, logLevel: string, sourceVersion: string, logPriority: number, logMessage: string, error: any}} logObject
	 * @private
	 */
	_printLogObject(logObject) {
		const str = `${logObject.logTimestamp.toISOString()} / [${logObject.logLevel}] / [${logObject.logTag}]: ${logObject.logMessage} /// ERROR /// ${logObject.error}`;
		switch (logObject.logPriority) {
		case 0: console.log(str); break;
		case 1: console.debug(str); break;
		case 2: console.info(str); break;
		case 3: console.warn(str); break;
		case 4: console.error(str); break;
		default: break;
		}
		super.emit('log', logObject);
	}

	/**
	 *
	 * @param {string} tag
	 * @param {string} message
	 * @param {any} [error]
	 */
	v(tag, message, error) {
		if(VERBOSE.priority < this._minLogLevel.priority) return;
		this._printLogObject(this._prepareLogObject(VERBOSE, tag, message, error));
	}

	/**
	 *
	 * @param {string} tag
	 * @param {string} message
	 * @param {any} [error]
	 */
	d(tag, message, error) {
		if(DEBUG.priority < this._minLogLevel.priority) return;
		this._printLogObject(this._prepareLogObject(DEBUG, tag, message, error));
	}

	/**
	 *
	 * @param {string} tag
	 * @param {string} message
	 * @param {any} [error]
	 */
	i(tag, message, error) {
		if(INFO.priority < this._minLogLevel.priority) return;
		this._printLogObject(this._prepareLogObject(INFO, tag, message, error));
	}

	/**
	 *
	 * @param {string} tag
	 * @param {string} message
	 * @param {any} [error]
	 */
	w(tag, message, error) {
		if(WARN.priority < this._minLogLevel.priority) return;
		this._printLogObject(this._prepareLogObject(WARN, tag, message, error));
	}

	/**
	 *
	 * @param {string} tag
	 * @param {string} message
	 * @param {any} [error]
	 */
	e(tag, message, error) {
		if(ERROR.priority < this._minLogLevel.priority) return;
		this._printLogObject(this._prepareLogObject(ERROR, tag, message, error));
	}

}

class ConsoleLoggerBuilder {

	/**
	 *
	 * @param {string} sourceId
	 * @return {ConsoleLoggerBuilder}
	 */
	setSourceId(sourceId) {
		this._sourceId = sourceId;
		return this;
	}

	/**
	 *
	 * @param {string} sourceMode
	 * @return {ConsoleLoggerBuilder}
	 */
	setSourceMode(sourceMode) {
		this._sourceMode = sourceMode;
		return this;
	}

	/**
	 *
	 * @param {string} sourceVersion
	 * @return {ConsoleLoggerBuilder}
	 */
	setSourceVersion(sourceVersion) {
		this._sourceVersion = sourceVersion;
		return this;
	}

	/**
	 *
	 * @param {LogLevel} minLogLevel
	 * @return {ConsoleLoggerBuilder}
	 */
	setMinLogLevel(minLogLevel) {
		this._minLogLevel = minLogLevel;
		return this;
	}

	/**
	 *
	 * @return {ConsoleLogger}
	 */
	build() {

		if(typeof this._sourceId !== 'string')
			throw new Error('sourceId must be string');

		if(typeof this._sourceMode !== 'string')
			throw new Error('sourceMode must be string');

		if(typeof this._sourceVersion !== 'string')
			throw new Error('sourceVersion must be string');

		if(!(this._minLogLevel instanceof LogLevel))
			throw new Error('minLogLevel must be instance of LogLevel');

		return new ConsoleLogger(
			this._sourceId,
			this._sourceVersion,
			this._sourceMode,
			this._minLogLevel
		);

	}

}


module.exports.ConsoleLoggerBuilder = ConsoleLoggerBuilder;
module.exports.ConsoleLogger = ConsoleLogger;
