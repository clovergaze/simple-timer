# Simple Timer

A simple Node module that implements timer functionality.

## Install

~~~bash
npm install @clovergaze/simple-timer
~~~

## Usage

~~~typescript
import {SimpleTimer} from "@clovergaze/simple-timer";

const simpleTimer: SimpleTimer = new SimpleTimer();

// Run timer for 180 seconds with console output when
// timer is started, finished or an error occurred
simpleTimer
    .on("start", () => { console.log("Timer started.."); })
    .on("finish", () => { console.log("Timer is done.."); })
    .on("error", (error) => { console.log(error.message + " (" + error.name + ")"); })
    .start(180);

// Retrieve log messages
simpleTimer.getLog().forEach((entry) => {
    console.log(entry.date + " - " + entry.message);
});

// Clear log
simpleTimer.clearLog();
~~~

### Methods

##### public start(seconds: number): void
Runs timer for specified number of *seconds*. Internally the timer uses a resolution of 100 ms.

##### public pause(): void
Pauses the timer. Calling the method again resumes the timer.

##### public stop(): void
Immediately stopps running the timer.

##### public getCurrentState(): SimpleTimer.State
Returns the current state of the timer. The state can be *RUNNING*, *PAUSED* or *STOPPED*.

##### public getLog(): SimpleLogger.Entry[]
Returns a list of log entries.

##### public clearLog(): void
Removes all entries from the log.

### Events

##### creation
Emitted once when the timer is created.

##### start
Emitted when the timer is started.

##### pause
Emitted when the timer is paused.

##### resume
Emitted when the timer resumes running after being paused.

##### stop
Emitted when the timer is explicitly stopped.

##### tick
Emitted every second the timer is running.

##### finish
Emitted when the specified time is up.

##### error
Emitted when an error occurred. This event also sends an argument of type Error with the name of the error and an error message. The error
name can be *TIMER_START_ERROR*, *TIMER_PAUSE_ERROR* or *TIMER_STOP_ERROR*.

## Development
For most development steps, like the continuous build mode, test coverage and releasing, everything has to be built first.

### Building

~~~bash
npm run build
~~~

This executes the [Grunt](https://gruntjs.com/) *build* task (via its *default* task), that lints and transpiles the sources.

#### Continuous build mode

~~~bash
npm run watch
~~~

### Testing

~~~bash
npm test
~~~

This executes test cases inside the *'./test'* folder using [Mocha](http://mochajs.org/). It is not required to build the sources first
when running this step, because [ts-node](https://www.npmjs.com/package/ts-node) is used to immediately execute the TypeScript files.

### Coverage

~~~bash
npm run coverage
~~~

This executes [istanbul](https://www.npmjs.com/package/istanbul) to assess the test coverage and
[remap-istanbul](https://www.npmjs.com/package/remap-istanbul) to generate reports for the TypeScript source.

### Releasing

~~~bash
npm run release
~~~

### Cleaning

~~~bash
npm run clean
~~~

Removes transpilation results and map files, but does not touch released files inside the *'./dist'* folder.

## Bugs & Issues

If there are any problems with this module or you find any bugs, then please feel free to create a new issue on the
[corresponding GitHub page](https://github.com/clovergaze/simple-timer/issues).

## Author

Johannes Hillert ([GitHub](https://github.com/clovergaze))

## License

Copyright (c) 2017 Johannes Hillert. Licensed under the MIT license, see the included LICENSE file for details.