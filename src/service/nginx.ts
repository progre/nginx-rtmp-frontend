import {ChildProcess, spawn} from "child_process";
import {EventEmitter} from "events";
import {dirname} from "path";
import * as log4js from "log4js";
const logger = log4js.getLogger();
import * as repository from "./repository";

export default class Nginx extends EventEmitter {
    private exePath: string;
    private process: ChildProcess;

    start(exePath: string) {
        logger.info("Server starting: ", exePath, "-c", repository.NGINX_CONFIG_PATH);
        this.exePath = exePath;
        if (exePath == null || exePath.length === 0) {
            this.exePath = "nginx";
        }
        let process = spawn(
            this.exePath,
            ["-c", repository.NGINX_CONFIG_PATH],
            { cwd: dirname(this.exePath) }
        );
        process.on("error", (e: any) => {
            logger.error("Server error", e);
        });
        process.on("close", () => {
            logger.info("Server closed");
            if (this.process === process) {
                this.process = null;
            }
            if (!this.isAlive) {
                this.emit("close");
            }
        });
        this.process = process;
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
    }

    get isAlive() {
        return this.process != null;
    }
}
