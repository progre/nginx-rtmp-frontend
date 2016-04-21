const app = require("app");
import * as promisify from "native-promisify";
import * as fs from "fs";
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
import {normalize} from "path";
import NginxConfig from "./nginxconfig";

const CONFIG_PATH = app.getPath("userData") + "/" + "config.json";
export const NGINX_CONFIG_PATH = app.getPath("userData") + "/" + "nginx.conf";
const NGINX_CONFIG_TEMPLATE_PATH = normalize(__dirname + "/../res/nginx-default.conf");

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
                /** @deprecated */ exePath: "",
                listenPort: 0,
                nginxPath: "",
                services: []
            };
        }
    }

    setConfig(config: Config) {
        this.nginxConfig.port = config.listenPort;
        for (let service of config.services) {
            if (service.enabled) {
                this.nginxConfig.enable(service.name);
            } else {
                this.nginxConfig.disable(service.name);
            }
            this.nginxConfig.setFms(service.name, service.fmsURL);
            this.nginxConfig.setKey(service.name, service.streamKey);
        }
        this.nginxConfig.save();
        return writeFile(CONFIG_PATH, JSON.stringify(config), { encoding: "ascii", flag: "w+" });
    }
}

export interface Config {
    /** @deprecated */ exePath: string;
    listenPort: number;
    nginxPath: string;
    services: {
        name: string;
        enabled: boolean;
        fmsURL: string;
        streamKey: string;
    }[]
}
