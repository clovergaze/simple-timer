import { expect } from "chai";
import { SimpleTimer } from "../src";
import Timer = NodeJS.Timer;

describe("Simple Timer", () => {
    let simpleTimer: SimpleTimer;

    beforeEach(() => {
        simpleTimer = new SimpleTimer();
    });

    it("should correctly initialize and emit a corresponding event when created", (done) => {
        simpleTimer.on("creation", () => {
            expect(simpleTimer.getCurrentState()).to.equal(SimpleTimer.State.STOPPED);
            expect(simpleTimer.getLog()[simpleTimer.getLog().length - 1].message).to.equal("CREATION");
            done();
        });
    });

    it("should set state to RUNNING and emit a corresponding event when started", (done) => {
        simpleTimer.start(3);

        simpleTimer.on("start", () => {
            expect(simpleTimer.getCurrentState()).to.equal(SimpleTimer.State.RUNNING);
            expect(simpleTimer.getLog()[simpleTimer.getLog().length - 1].message).to.equal("START");
            simpleTimer.stop();
            done();
        });
    });

    it("should emit an error if currently running and started a second time", (done) => {
        simpleTimer.start(3);

        simpleTimer.on("start", () => {
            expect(simpleTimer.getCurrentState()).to.equal(SimpleTimer.State.RUNNING);
            expect(simpleTimer.getLog()[simpleTimer.getLog().length - 1].message).to.equal("START");

            setTimeout(() => {
                // Trying to start timer a second time should result in an error
                simpleTimer.start(5);
            }, 1500);
        });

        simpleTimer.on("error", (error) => {
            expect(error).to.not.be.null;
            expect(error.name).to.equal("TIMER_START_ERROR");
            expect(error.message).to.equal("Can not start timer again, timer has to be stopped first.");
            expect(simpleTimer.getCurrentState()).to.equal(SimpleTimer.State.RUNNING);
            simpleTimer.stop();
            done();
        });
    });

    it("should be able to stop running, reset and emit a corresponding event", (done) => {
        simpleTimer.start(3);

        simpleTimer.on("start", () => {
            expect(simpleTimer.getCurrentState()).to.equal(SimpleTimer.State.RUNNING);
            expect(simpleTimer.getLog()[simpleTimer.getLog().length - 1].message).to.equal("START");
            simpleTimer.stop();
        });

        simpleTimer.on("stop", () => {
            expect(simpleTimer.getCurrentState()).to.equal(SimpleTimer.State.STOPPED);
            expect(simpleTimer.getLog()[simpleTimer.getLog().length - 1].message).to.equal("STOP");
            done();
        });
    });

    it("should emit an error if timer is not running and explicitly stopped", (done) => {
        simpleTimer.stop();

        simpleTimer.on("error", (error) => {
            expect(error).to.not.be.null;
            expect(error.name).to.equal("TIMER_STOP_ERROR");
            expect(error.message).to.equal("Can not stop timer, timer is already stopped.");
            expect(simpleTimer.getCurrentState()).to.equal(SimpleTimer.State.STOPPED);
            done();
        });
    });

    it("should be able to finish after the specified amount of seconds and emit a corresponding event", (done) => {
        const seconds = 3;

        // Reference timer
        let timer: Timer;
        let totalRuntime: number = 0;

        timer = setInterval(() => {
            totalRuntime++;
        }, 1000);

        simpleTimer.start(seconds);

        simpleTimer.on("finish", () => {
            // Stop reference timer
            clearInterval(timer);

            expect(simpleTimer.getCurrentState()).to.equal(SimpleTimer.State.STOPPED);
            expect(simpleTimer.getLog()[simpleTimer.getLog().length - 1].message).to.equal("FINISH");

            expect(totalRuntime).to.equal(seconds);

            done();
        });
    });

    it("should emit a tick event every second when started and running", (done) => {
        const seconds: number = 3;

        let secondsCounter: number = 0;

        // Reference timer
        let timer: Timer;
        let totalRuntime: number = 0;

        timer = setInterval(() => {
            totalRuntime++;
        }, 1000);

        simpleTimer.start(seconds);

        simpleTimer.on("tick", () => {
            expect(simpleTimer.getCurrentState()).to.equal(SimpleTimer.State.RUNNING);
            expect(simpleTimer.getLog()[simpleTimer.getLog().length - 1].message).to.equal("START");
            secondsCounter++;
        });

        simpleTimer.on("finish", () => {
            // Stop reference timer
            clearInterval(timer);

            // Last tick event is omitted
            secondsCounter++;

            expect(simpleTimer.getCurrentState()).to.equal(SimpleTimer.State.STOPPED);
            expect(simpleTimer.getLog()[simpleTimer.getLog().length - 1].message).to.equal("FINISH");

            expect(secondsCounter).to.equal(seconds);
            expect(totalRuntime).to.equal(seconds);

            done();
        });
    });

    it("should be able to pause, set PAUSED state and emit a corresponding event", (done) => {
        simpleTimer.start(3);

        simpleTimer.on("start", () => {
            expect(simpleTimer.getCurrentState()).to.equal(SimpleTimer.State.RUNNING);
            expect(simpleTimer.getLog()[simpleTimer.getLog().length - 1].message).to.equal("START");

            setTimeout(() => {
                simpleTimer.pause();
            }, 500);
        });

        simpleTimer.on("pause", () => {
            expect(simpleTimer.getCurrentState()).to.equal(SimpleTimer.State.PAUSED);
            expect(simpleTimer.getLog()[simpleTimer.getLog().length - 1].message).to.equal("PAUSE");
            simpleTimer.stop();
            done();
        });
    });

    it("should be able to stop while being paused", (done) => {
        simpleTimer.start(3);

        simpleTimer.on("start", () => {
            expect(simpleTimer.getCurrentState()).to.equal(SimpleTimer.State.RUNNING);
            expect(simpleTimer.getLog()[simpleTimer.getLog().length - 1].message).to.equal("START");

            setTimeout(() => {
                simpleTimer.pause();
            }, 500);
        });

        simpleTimer.on("pause", () => {
            expect(simpleTimer.getCurrentState()).to.equal(SimpleTimer.State.PAUSED);
            expect(simpleTimer.getLog()[simpleTimer.getLog().length - 1].message).to.equal("PAUSE");
            simpleTimer.stop();
        });

        simpleTimer.on("stop", () => {
            expect(simpleTimer.getCurrentState()).to.equal(SimpleTimer.State.STOPPED);
            expect(simpleTimer.getLog()[simpleTimer.getLog().length - 1].message).to.equal("STOP");
            done();
        });
    });

    it("should be able to resume running after being paused", (done) => {
        simpleTimer.start(3);

        simpleTimer.on("start", () => {
            expect(simpleTimer.getCurrentState()).to.equal(SimpleTimer.State.RUNNING);
            expect(simpleTimer.getLog()[simpleTimer.getLog().length - 1].message).to.equal("START");

            setTimeout(() => {
                simpleTimer.pause();
            }, 500);
        });

        simpleTimer.on("pause", () => {
            expect(simpleTimer.getCurrentState()).to.equal(SimpleTimer.State.PAUSED);
            expect(simpleTimer.getLog()[simpleTimer.getLog().length - 1].message).to.equal("PAUSE");

            setTimeout(() => {
                simpleTimer.pause();
            }, 500);
        });

        simpleTimer.on("resume", () => {
            expect(simpleTimer.getCurrentState()).to.equal(SimpleTimer.State.RUNNING);
            expect(simpleTimer.getLog()[simpleTimer.getLog().length - 1].message).to.equal("RESUME");
            simpleTimer.stop();
            done();
        });
    });

    it("should be able to finish after being paused", (done) => {
        const seconds: number = 3;

        let secondsCounter: number = 0;

        const pauseTime: number = 2; // Length in seconds of pause
        const maxPause: number = 3; // Number of times test pauses
        let pauseCounter: number = 0;

        // Reference timer
        let timer: Timer;
        let totalRunningTime: number = 0;

        timer = setInterval(() => {
            totalRunningTime++;
        }, 1000);

        simpleTimer.start(seconds);

        simpleTimer.on("start", () => {
            expect(simpleTimer.getCurrentState()).to.equal(SimpleTimer.State.RUNNING);
            expect(simpleTimer.getLog()[simpleTimer.getLog().length - 1].message).to.equal("START");

            setTimeout(() => {
                pauseCounter++;
                simpleTimer.pause();
            }, 1200);
        });

        simpleTimer.on("resume", () => {
            expect(simpleTimer.getCurrentState()).to.equal(SimpleTimer.State.RUNNING);
            expect(simpleTimer.getLog()[simpleTimer.getLog().length - 1].message).to.equal("RESUME");

            if (pauseCounter < maxPause) {
                setTimeout(() => {
                    pauseCounter++;
                    simpleTimer.pause();
                }, 200);
            }
        });

        simpleTimer.on("pause", () => {
            expect(simpleTimer.getCurrentState()).to.equal(SimpleTimer.State.PAUSED);
            expect(simpleTimer.getLog()[simpleTimer.getLog().length - 1].message).to.equal("PAUSE");

            setTimeout(() => {
                simpleTimer.pause();
            }, pauseTime * 1000);
        });

        simpleTimer.on("tick", () => {
            expect(simpleTimer.getCurrentState()).to.equal(SimpleTimer.State.RUNNING);
            secondsCounter++;
        });

        simpleTimer.on("finish", () => {
            // Stop reference timer
            clearInterval(timer);

            // Last tick event is omitted
            secondsCounter++;

            expect(simpleTimer.getCurrentState()).to.equal(SimpleTimer.State.STOPPED);
            expect(simpleTimer.getLog()[simpleTimer.getLog().length - 1].message).to.equal("FINISH");

            expect(secondsCounter).to.equal(seconds);
            expect(totalRunningTime).to.equal(seconds + (maxPause * pauseTime));

            done();
        });
    });

    it("should emit an error if it is paused and started a second time", (done) => {
        simpleTimer.start(3);

        simpleTimer.on("start", () => {
            expect(simpleTimer.getCurrentState()).to.equal(SimpleTimer.State.RUNNING);
            expect(simpleTimer.getLog()[simpleTimer.getLog().length - 1].message).to.equal("START");

            setTimeout(() => {
                simpleTimer.pause();
            }, 600);
        });

        simpleTimer.on("pause", () => {
            expect(simpleTimer.getCurrentState()).to.equal(SimpleTimer.State.PAUSED);
            expect(simpleTimer.getLog()[simpleTimer.getLog().length - 1].message).to.equal("PAUSE");

            setTimeout(() => {
                // Trying to start timer while it is paused should result in an error
                simpleTimer.start(5);
            }, 200);
        });

        simpleTimer.on("error", (error) => {
            expect(error).to.not.be.null;
            expect(error.name).to.equal("TIMER_START_ERROR");
            expect(error.message).to.equal("Can not start timer again, timer has to be stopped first.");
            expect(simpleTimer.getCurrentState()).to.equal(SimpleTimer.State.PAUSED);
            simpleTimer.stop();
            done();
        });
    });

    it("should emit an error if it is stopped and explicitly paused", (done) => {
        simpleTimer.pause();

        simpleTimer.on("error", (error) => {
            expect(error).to.not.be.null;
            expect(error.name).to.equal("TIMER_PAUSE_ERROR");
            expect(error.message).to.equal("Can not pause or resume timer, timer is currently stopped.");
            expect(simpleTimer.getCurrentState()).to.equal(SimpleTimer.State.STOPPED);
            done();
        });
    });

    it("should be able to clear log messages", (done) => {
        const seconds: number = 2;
        const pauseTime: number = 1; // Pause for 1 seconds

        simpleTimer.start(seconds);

        simpleTimer.on("start", () => {
            expect(simpleTimer.getCurrentState()).to.equal(SimpleTimer.State.RUNNING);
            expect(simpleTimer.getLog()[simpleTimer.getLog().length - 1].message).to.equal("START");

            setTimeout(() => {
                simpleTimer.pause();
            }, 1200);
        });

        simpleTimer.on("pause", () => {
            expect(simpleTimer.getCurrentState()).to.equal(SimpleTimer.State.PAUSED);
            expect(simpleTimer.getLog()[simpleTimer.getLog().length - 1].message).to.equal("PAUSE");

            setTimeout(() => {
                simpleTimer.pause();
            }, pauseTime * 1000);
        });

        simpleTimer.on("finish", () => {
            expect(simpleTimer.getCurrentState()).to.equal(SimpleTimer.State.STOPPED);
            expect(simpleTimer.getLog()[simpleTimer.getLog().length - 1].message).to.equal("FINISH");

            // Log should be: CREATION, START, PAUSE, RESUME, FINISH
            expect(simpleTimer.getLog().length).to.equal(5);

            // Clear log
            simpleTimer.clearLog();

            expect(simpleTimer.getLog().length).to.equal(0);

            done();
        });
    });
});
