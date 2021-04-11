import { EventEmitter } from "events";
import { SimpleLogger } from "@clovergaze/simple-logger";

export class SimpleTimer extends EventEmitter {
    private timer: NodeJS.Timer;
    private currentState: SimpleTimer.State;
    private remainingTime: number;
    private logger: SimpleLogger;

    constructor() {
        super();

        this.logger = new SimpleLogger();

        this.setCurrentState(SimpleTimer.State.STOPPED, "creation");
    }

    public start(seconds: number): void {
        if (this.currentState === SimpleTimer.State.STOPPED) {
            this.remainingTime = 10 * seconds;

            this.timer = setInterval(() => {
                this.tick();
            }, 100);

            this.setCurrentState(SimpleTimer.State.RUNNING, "start");
        } else {
            this.error("TIMER_START_ERROR", "Can not start timer again, timer has to be stopped first.");
        }
    }

    public pause(): void {
        if (this.currentState === SimpleTimer.State.RUNNING) {
            clearInterval(this.timer);

            this.setCurrentState(SimpleTimer.State.PAUSED, "pause");
        } else if (this.currentState === SimpleTimer.State.PAUSED) {
            this.timer = setInterval(() => {
                this.tick();
            }, 100);

            this.setCurrentState(SimpleTimer.State.RUNNING, "resume");
        } else {
            this.error("TIMER_PAUSE_ERROR", "Can not pause or resume timer, timer is currently stopped.");
        }
    }

    public stop(): void {
        if (this.currentState !== SimpleTimer.State.STOPPED) {
            clearInterval(this.timer);
            this.remainingTime = 0;

            this.setCurrentState(SimpleTimer.State.STOPPED, "stop");
        } else {
            this.error("TIMER_STOP_ERROR", "Can not stop timer, timer is already stopped.");
        }
    }

    public getCurrentState(): SimpleTimer.State {
        return this.currentState;
    }

    public getLog(): SimpleLogger.Entry[] {
        return this.logger.getLog();
    }

    public clearLog(): void {
        this.logger.clearLog();
    }

    protected setCurrentState(state: SimpleTimer.State, event: string): void {
        this.currentState = state;

        setImmediate(() => {
            this.emit(event);
        });

        this.logger.log(event.toUpperCase());
    }

    protected tick(): void {
        this.remainingTime--;

        if (this.remainingTime <= 0) {
            this.finish();
        } else if (this.remainingTime % 10 === 0) {
            setImmediate(() => {
                this.emit("tick");
            });
        }
    }

    protected finish(): void {
        clearInterval(this.timer);
        this.setCurrentState(SimpleTimer.State.STOPPED, "finish");
    }

    protected error(name: string, message: string): void {
        const error: Error = new Error();

        error.name = name;
        error.message = message;

        setImmediate(() => {
            this.emit("error", error);
        });
    }
}

export namespace SimpleTimer {
    export enum State {
        STOPPED,
        RUNNING,
        PAUSED
    }
}
