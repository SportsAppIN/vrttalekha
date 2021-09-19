'use strict';

const TAG = 'mqtt-logger';
const mqtt = require('mqtt');
const ConsoleLogger = require('../console-logger');
const {LogLevel, LogLevelModel} = require('../models/log-level');

class MQTTLogger extends ConsoleLogger {

	/**
	 *
	 * @param {MQTTBrokerClient} brokerClient
	 * @param {string} logSourceId
	 * @param {string} logSourceVersion
	 * @param {string} logSourceMode
	 * @param {string} defaultLogTag
	 * @param {LogLevelModel} minLogLevel
	 */
	constructor(brokerClient, logSourceId, logSourceVersion, logSourceMode, defaultLogTag, minLogLevel) {
		super(logSourceId, logSourceVersion, logSourceMode, defaultLogTag, minLogLevel);
		this._brokerClient = brokerClient;
		this._mqttClient = mqtt.connect(
			{
				host: this._brokerClient.brokerHost,
				port: this._brokerClient.brokerPort,
				protocol: this._brokerClient.brokerProtocol,
				username: this._brokerClient.brokerAuthUsername,
				password: this._brokerClient.brokerAuthPassword
			}
		);
		this._setupMqttClientListeners();
	}

	/**
	 *
	 * @private
	 */
	_setupMqttClientListeners() {
		if(this._mqttClient === null)
			return;
		this._mqttClient.on('connect', () => super.v(TAG, 'mqttClient: connect success'));
		this._mqttClient.on('error', err => super.v(TAG, 'mqttClient: error', err));
		this._mqttClient.on('close', () => super.v(TAG, 'mqttClient: closed'));
		this._mqttClient.on('end', () => super.v(TAG, 'mqttClient: end'));
		this._mqttClient.on('reconnect', () => super.v(TAG, 'mqttClient: reconnect'));
		this._mqttClient.on('offline', () => super.v(TAG, 'mqttClient: offline'));
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
					this._publishLogsToBroker(logLevel, TAG1, message1, error1);
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
					this._publishLogsToBroker(logLevel, TAG1, message1, error1);
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
					this._publishLogsToBroker(logLevel, TAG1, message1, error1);
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
					this._publishLogsToBroker(logLevel, TAG1, message1, error1);
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
					this._publishLogsToBroker(logLevel, TAG1, message1, error1);
				}
			});
	}

	/**
	 * @param {LogLevelModel} level
	 * @param {string} TAG
	 * @param {string} message
	 * @param {string} error
	 *
	 * @private
	 */
	_publishLogsToBroker(level, TAG, message, error) {

		this._mqttClient.publish(
			this._brokerClient.brokerPublishLogsTopic,
			JSON.stringify({
				logSourceId: this._logSourceId,
				logSourceVersion: this._logSourceVersion,
				logSourceMode: this._logSourceMode,
				logType: level.name,
				logTag: TAG,
				logMessage: message,
				logError: error
			}),
			error => {

				if(error) {
					super.e(TAG, 'publishLogsToBroker: error', error);
				}

			}
		);

	}

}

class MQTTBrokerClient {

	/**
	 *
	 * @param {string} brokerHost
	 * @param {number} brokerPort
	 * @param {'mqtt'|'mqtts'} brokerProtocol
	 * @param {string} brokerAuthUsername
	 * @param {string} brokerAuthPassword
	 * @param {string} brokerPublishLogsTopic
	 */
	constructor(
		brokerHost,
		brokerPort,
		brokerProtocol,
		brokerAuthUsername,
		brokerAuthPassword,
		brokerPublishLogsTopic
	) {
		this._brokerHost = brokerHost;
		this._brokerPort = brokerPort;
		this._brokerProtocol = brokerProtocol;
		this._brokerAuthUsername = brokerAuthUsername;
		this._brokerAuthPassword = brokerAuthPassword;
		this._brokerPublishLogsTopic = brokerPublishLogsTopic;
	}


	get brokerHost() {
		return this._brokerHost;
	}

	get brokerPort() {
		return this._brokerPort;
	}

	get brokerProtocol() {
		return this._brokerProtocol;
	}

	get brokerAuthUsername() {
		return this._brokerAuthUsername;
	}

	get brokerAuthPassword() {
		return this._brokerAuthPassword;
	}

	get brokerPublishLogsTopic() {
		return this._brokerPublishLogsTopic;
	}
}

MQTTLogger.BrokerClientBuilder = class {

	constructor() {
		this._mqttBrokerHost = null;
		this._mqttBrokerPort = null;
		this._mqttBrokerProtocol = null;
		this._mqttBrokerAuthUsername = null;
		this._mqttBrokerAuthPassword = null;
		this._mqttPublishLogsTopic = null;
	}

	/**
	 *
	 * @param {string} host domain/ip of mqtt broker host
	 * @return {MQTTLogger.BrokerClientBuilder}
	 */
	setBrokerHost(host) {
		if(typeof host !== 'string')
			throw new Error('host must be of type string');
		this._mqttBrokerHost = host;
		return this;
	}

	/**
	 *
	 * @param {number} port Mqtt broker port (0-65536)
	 * @return {MQTTLogger.BrokerClientBuilder}
	 */
	setBrokerPort(port) {
		if(typeof port !== 'number' || port < 0 || port > 65536)
			throw new Error('port must be a number between 0 and 65536');
		this._mqttBrokerPort = port;
		return this;
	}

	/**
	 *
	 * @param {'mqtt'|'mqtts'} protocol Protocol to be used to connect mqtt broker
	 * @return {MQTTLogger.BrokerClientBuilder}
	 */
	setBrokerProtocol(protocol) {
		if(protocol !== 'mqtt' && protocol !== 'mqtts')
			throw new Error('protocol must be either mqtt or mqtts');
		this._mqttBrokerProtocol = protocol;
		return this;
	}

	/**
	 *
	 * @param {string} username
	 * @return {MQTTLogger.BrokerClientBuilder}
	 */
	setAuthUsername(username) {
		if(typeof username !== 'string')
			throw new Error('username must be a string');
		this._mqttBrokerAuthUsername = username;
		return this;
	}

	/**
	 *
	 * @param {string} password
	 * @return {MQTTLogger.BrokerClientBuilder}
	 */
	setAuthPassword(password) {
		if(typeof password !== 'string')
			throw new Error('password must be a string');
		this._mqttBrokerAuthPassword = password;
		return this;
	}

	/**
	 *
	 * @param {string} logsTopicName Mqtt topic on which logs should be published
	 * @return {MQTTLogger.BrokerClientBuilder}
	 */
	setLogsTopic(logsTopicName) {
		if(typeof logsTopicName !== 'string')
			throw new Error('logsTopicName must be string');
		this._mqttPublishLogsTopic = logsTopicName;
		return this;
	}

	/**
	 *
	 * @return {MQTTBrokerClient}
	 */
	build() {
		if(
			this._mqttBrokerHost === null ||
			this._mqttBrokerPort === null ||
			this._mqttBrokerAuthPassword === null ||
			this._mqttBrokerAuthUsername === null ||
			this._mqttPublishLogsTopic === null ||
			this._mqttBrokerProtocol === null
		)
			throw new Error('could not build mqtt broker client as data was insufficient. did you call all set methods on builder?');

		return new MQTTBrokerClient(
			this._mqttBrokerHost,
			this._mqttBrokerPort,
			this._mqttBrokerProtocol,
			this._mqttBrokerAuthUsername,
			this._mqttBrokerAuthPassword,
			this._mqttPublishLogsTopic
		);
	}

};

MQTTLogger.Builder = class {

	constructor() {
		this._mqttBrokerClient = null;
		this._logSourceId = 'libloggerjs';
		this._logSourceVersion = '2021.9.2';
		this._logSourceMode = 'debug';
		this._defaultLogTag = 'libloggerjs';
		this._minLogLevel = LogLevel.VERBOSE;
	}

	/**
	 *
	 * @param {MQTTBrokerClient} brokerClient
	 * @return {MQTTLogger.Builder}
	 */
	setMqttBrokerClient(brokerClient) {
		if(!(brokerClient instanceof MQTTBrokerClient))
			throw new Error('brokerClient must be an instance of MQTTBrokerClient. Use MQTTLogger.BrokerClientBuilder to create an instance');
		this._mqttBrokerClient = brokerClient;
		return this;
	}


	/**
	 *
	 * @param {string} sourceId
	 * @return {MQTTLogger.Builder}
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
	 * @return {MQTTLogger.Builder}
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
	 * @return {MQTTLogger.Builder}
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
	 * @return {MQTTLogger.Builder}
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
	 * @return {MQTTLogger.Builder}
	 */
	setMinLogLevel(minLogLevel) {
		if (!(minLogLevel instanceof LogLevelModel))
			throw new Error('minLogLevel must be an instance of LogLevelModel');
		this._minLogLevel = minLogLevel;
		return this;
	}

	/**
	 *
	 * @return {MQTTLogger}
	 */
	build() {

		if(this._mqttBrokerClient === null)
			throw new Error('could not builder mqtt logger due to insufficient data');

		return new MQTTLogger(
			this._mqttBrokerClient,
			this._logSourceId,
			this._logSourceVersion,
			this._logSourceMode,
			this._defaultLogTag,
			this._minLogLevel
		);
	}

};

module.exports = MQTTLogger;
