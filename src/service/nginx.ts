import {ChildProcess, spawn} from 'child_process';
import * as log4js from 'log4js';
const logger = log4js.getLogger();
import * as repository from './repository';

export default class Nginx {
    private exePath: string;

    private process: Process;

    start(exePath: string) {
        this.exePath = exePath;
        this.process = new Process(this.exePath, repository.NGINX_CONFIG_PATH);
    }

    restart() {
        this.stop();
        this.start(this.exePath);
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
        logger.info(exePath, confPath);
        this.process = spawn(this.exePath, ['-c', this.confPath]);
    }

    kill() {
        this.process.kill();
    }
}
