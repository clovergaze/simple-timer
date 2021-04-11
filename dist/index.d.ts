/// <reference types="node" />
import { EventEmitter } from "events";
import { SimpleLogger } from "@clovergaze/simple-logger";
export declare class SimpleTimer extends EventEmitter {
    private timer;
    private currentState;
    private remainingTime;
    private logger;
    constructor();
    start(seconds: number): void;
    pause(): void;
    stop(): void;
    getCurrentState(): SimpleTimer.State;
    getLog(): SimpleLogger.Entry[];
    clearLog(): void;
    protected setCurrentState(state: SimpleTimer.State, event: string): void;
    protected tick(): void;
    protected finish(): void;
    protected error(name: string, message: string): void;
}
export declare namespace SimpleTimer {
    enum State {
        STOPPED = 0,
        RUNNING = 1,
        PAUSED = 2
    }
}
