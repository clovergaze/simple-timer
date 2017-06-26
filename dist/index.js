"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const simple_logger_1 = require("@clovergaze/simple-logger");
class SimpleTimer extends events_1.EventEmitter {
    constructor() {
        super();
        this.logger = new simple_logger_1.SimpleLogger();
        this.setCurrentState(SimpleTimer.State.STOPPED, "creation");
    }
    start(seconds) {
        if (this.currentState === SimpleTimer.State.STOPPED) {
            this.remainingTime = 10 * seconds;
            this.timer = setInterval(() => {
                this.tick();
            }, 100);
            this.setCurrentState(SimpleTimer.State.RUNNING, "start");
        }
        else {
            this.error("TIMER_START_ERROR", "Can not start timer again, timer has to be stopped first.");
        }
    }
    pause() {
        if (this.currentState === SimpleTimer.State.RUNNING) {
            clearInterval(this.timer);
            this.setCurrentState(SimpleTimer.State.PAUSED, "pause");
        }
        else if (this.currentState === SimpleTimer.State.PAUSED) {
            this.timer = setInterval(() => {
                this.tick();
            }, 100);
            this.setCurrentState(SimpleTimer.State.RUNNING, "resume");
        }
        else {
            this.error("TIMER_PAUSE_ERROR", "Can not pause or resume timer, timer is currently stopped.");
        }
    }
    stop() {
        if (this.currentState !== SimpleTimer.State.STOPPED) {
            clearInterval(this.timer);
            this.remainingTime = 0;
            this.setCurrentState(SimpleTimer.State.STOPPED, "stop");
        }
        else {
            this.error("TIMER_STOP_ERROR", "Can not stop timer, timer is already stopped.");
        }
    }
    getCurrentState() {
        return this.currentState;
    }
    getLog() {
        return this.logger.getLog();
    }
    clearLog() {
        this.logger.clearLog();
    }
    setCurrentState(state, event) {
        this.currentState = state;
        setImmediate(() => {
            this.emit(event);
        });
        this.logger.log(event.toUpperCase());
    }
    tick() {
        this.remainingTime--;
        if (this.remainingTime <= 0) {
            this.finish();
        }
        else if (this.remainingTime % 10 === 0) {
            setImmediate(() => {
                this.emit("tick");
            });
        }
    }
    finish() {
        clearInterval(this.timer);
        this.setCurrentState(SimpleTimer.State.STOPPED, "finish");
    }
    error(name, message) {
        const error = new Error();
        error.name = name;
        error.message = message;
        setImmediate(() => {
            this.emit("error", error);
        });
    }
}
exports.SimpleTimer = SimpleTimer;
(function (SimpleTimer) {
    var State;
    (function (State) {
        State[State["STOPPED"] = 0] = "STOPPED";
        State[State["RUNNING"] = 1] = "RUNNING";
        State[State["PAUSED"] = 2] = "PAUSED";
    })(State = SimpleTimer.State || (SimpleTimer.State = {}));
})(SimpleTimer = exports.SimpleTimer || (exports.SimpleTimer = {}));
