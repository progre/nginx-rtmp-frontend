import {ChildProcess, spawn} from 'child_process';
import {EventEmitter} from 'events';
import {dirname} from 'path';
import * as log4js from 'log4js';
const logger = log4js.getLogger();
import * as repository from './repository';

export default class Nginx extends EventEmitter {
    private exePath: string;
    private process: ChildProcess;

    start(exePath: string) {
        logger.info('start server: ', exePath, '-c', repository.NGINX_CONFIG_PATH);
        this.exePath = exePath;
        this.process = spawn(
            this.exePath,
            ['-c', repository.NGINX_CONFIG_PATH],
            { cwd: dirname(this.exePath) }
        );
        this.process.on('close', () => {
            logger.info('server closed');
            if (!this.isAlive) {
                this.emit('close');
            }
        });
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

    get isAlive() {
        return this.process != null;
    }
}
