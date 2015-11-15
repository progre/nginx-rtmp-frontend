import {ChildProcess, spawn} from 'child_process';

export default class Nginx {
    exePath: string;
    confPath: string;

    private process: Process;

    start() {
        this.process = new Process(this.exePath, this.confPath);
    }

    restart() {
        this.stop();
        this.start();
    }

    stop() {
        if (this.process == null) {
            return;
        }
        this.process.kill();
        this.process = null;
    }
}

class Process {
    private process: ChildProcess;

    constructor(private exePath: string, private confPath: string) {
        this.process = spawn(this.exePath, ['-c', this.confPath]);
    }

    kill() {
        this.process.kill();
    }
}
