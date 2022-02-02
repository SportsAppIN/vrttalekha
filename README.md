#vrttalekha

Your goto logging client for javascript projects.

```js
const {ConsoleLoggerBuilder} = require('@sportsappin/vrttalekha/console-logger');
const {VERBOSE} = require('@sportsappin/vrttalekha/log-level');

const Log = new ConsoleLoggerBuilder()
    .setSourceMode('development')
    .setMinLogLevel(VERBOSE)
    .setSourceVersion('2022.2.1')
    .setSourceId('test-source')
    .build();

Log.e('sample-tag', 'sample-message', new Error());
```

You can easily attach a listener to watch for log events and process them as you want.

```js
Log.on('log', obj => {
	
	logStreamProcessor.publishLog(obj);
	
});
```

