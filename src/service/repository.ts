import { app } from "electron";
const promisify = require("native-promisify");
import * as fs from "fs";
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
import { normalize } from "path";
import NginxConfig from "./nginxconfig";

const CONFIG_PATH = app.getPath("userData") + "/" + "config.json";
export const NGINX_CONFIG_PATH = app.getPath("userData") + "/" + "nginx.conf";
const NGINX_CONFIG_TEMPLATE_PATH = normalize("./lib/res/nginx-default.conf");

export default class Repository {
    static async new() {
        return new this(await NginxConfig.new(NGINX_CONFIG_PATH, NGINX_CONFIG_TEMPLATE_PATH));
    }

    constructor(public nginxConfig: NginxConfig) {
    }

    release() {
        this.nginxConfig.release();
    }

    async getConfig() {
        try {
            let data = await readFile(CONFIG_PATH, "ascii");
            return <Config>JSON.parse(data);
        } catch (e) {
            return <Config>{
                exePath: ""
            };
        }
    }

    setConfig(config: Config) {
        return writeFile(CONFIG_PATH, JSON.stringify(config), { encoding: "ascii", flag: "w+" });
    }
}

export interface Config {
    exePath: string;
}
