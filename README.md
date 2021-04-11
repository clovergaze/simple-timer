# Simple Timer

A simple Node module that implements a timer with logging.

## Install

```bash
npm install @clovergaze/simple-timer
```

## Usage

```typescript
import { SimpleTimer } from "@clovergaze/simple-timer";
import { SimpleLogger } from "@clovergaze/simple-logger";

const simpleTimer: SimpleTimer = new SimpleTimer();

// Runs timer for 30 seconds with console output when the
// timer is started, has finished or if an error occurred.
simpleTimer
    .on("start", () => {
        console.log("Timer started..");
    })
    .on("finish", () => {
        console.log("Timer finished..");

        // Retrieve log messages
        simpleTimer.getLog().forEach((entry: SimpleLogger.Entry): void => {
            console.log(`${entry.date} - ${entry.message}`);
        });
    })
    .on("error", (error) => {
        console.log(`${error.message} (name=${error.name})`);
    })
    .start(30);
```

Output on the console is:

```text
Timer started..
Timer has finished..
Sun Apr 11 2021 21:58:18 GMT+0200 (Central European Summer Time) - CREATION
Sun Apr 11 2021 21:58:18 GMT+0200 (Central European Summer Time) - START
Sun Apr 11 2021 21:58:48 GMT+0200 (Central European Summer Time) - FINISH
```

## Methods

### `public start(seconds: number): void`

Runs timer for specified number of `seconds`. Internally the timer uses a resolution of 100 ms.

### `public pause(): void`

Pauses the timer. Calling this method when the timer is paused resumes the timer.

### `public stop(): void`

Immediately stops running the timer.

### `public getCurrentState(): SimpleTimer.State`

Returns the current state of the timer. The state can be `RUNNING`, `PAUSED` or `STOPPED`.

### `public getLog(): SimpleLogger.Entry[]`

Returns a list of log entries.

### `public clearLog(): void`

Removes all entries from the log.

## Events

Use `on` to listen for these events.

### `creation`

Emitted once when the timer is created.

### `start`

Emitted once when the timer is started.

### `pause`

Emitted when the timer gets paused.

### `resume`

Emitted when the timer resumes running after being paused.

### `stop`

Emitted once when the timer has been explicitly stopped.

### `tick`

Emitted every second the timer is running.

### `finish`

Emitted once when the specified time is up.

### `error`

Emitted if an error occurred.

This event also emits an argument of type `Error` that contains the `name` of the error and the error `message`. The
error's `name` property can be `TIMER_START_ERROR`, `TIMER_PAUSE_ERROR` or `TIMER_STOP_ERROR`.

## Development

For most development steps, like continuous build mode, test coverage report generation and releasing, everything must
be built first. Running tests is an exception, here the TypeScript files are used directly.

### Building

```bash
npm run build
```

This executes the [Grunt](https://gruntjs.com/) `build:dev` task (via the `default` task) which lints and transpiles the
source files.

To build the production version run:

```bash
npm run build:prod
```

This omits source map file generation. Generating them leave comments in the generated JavaScript files that are not
needed in the production code.

#### Continuous build mode

```bash
npm run watch
```

### Testing

```bash
npm test
```

This executes test cases inside the `test` folder which use [Mocha](http://mochajs.org/).

It is not required to build the sources first when running this step,
because [ts-node](https://www.npmjs.com/package/ts-node) is used to immediately execute the TypeScript files.

### Coverage

```bash
npm run coverage
```

This executes [istanbul](https://www.npmjs.com/package/istanbul) to assess the test coverage and
[remap-istanbul](https://www.npmjs.com/package/remap-istanbul) to generate reports for the TypeScript sources.

### Releasing

```bash
npm run release
```

This runs a production build and copies the relevant files to the `dist` folder.

### Cleaning

```bash
npm run clean
```

This removes all generated files and folders but does not touch the `dist` folder or files it contains.

## Bugs & Issues

Something is not working as intended? Please report bugs or issues on
the [corresponding GitHub page](https://github.com/clovergaze/simple-timer/issues).

## Author

Johannes Hillert ([GitHub](https://github.com/clovergaze))

## License

Copyright (c) 2017 Johannes Hillert. Licensed under the MIT license, see the included LICENSE file for details.
