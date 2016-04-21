const app = require("app");
import * as promisify from "native-promisify";
import * as fs from "fs";
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
import {normalize} from "path";
import {write as writeNginxConfig} from "./nginxconfig";

const SERVICES = ["twitch", "peercaststation", "cavetube", "livecodingtv", "niconico", "other"];

export default class Repository {
    static async create() {
        let instance = new this();
        await writeNginxConfig(
            getNginxConfigPath(),
            getNginxConfigTemplatePath(),
            await instance.getConfig());
        return instance;
    }

    async getConfig() {
        let config: Config;
        try {
            let data = await readFile(getConfigPath(), "ascii");
            config = <Config>JSON.parse(data);
        } catch (e) {
            config = <Config>{};
        }
        if (config.listenPort == null) {
            config.listenPort = 1935;
        }
        if (config.nginxPath == null) {
            config.nginxPath = "";
        }
        if (config.services == null) {
            config.services = [];
        }
        for (let service of SERVICES) {
            let configService = config.services.find(x => x.name === service);
            if (configService == null) {
                config.services.push({
                    name: service,
                    enabled: false,
                    fmsURL: "",
                    streamKey: ""
                });
                continue;
            }
            if (configService.enabled == null) {
                configService.enabled = false;
            }
            if (configService.fmsURL == null) {
                configService.fmsURL = "";
            }
            if (configService.streamKey == null) {
                configService.streamKey = "";
            }
        }
        return config;
    }

    setConfig(config: Config) {
        writeNginxConfig(
            getNginxConfigPath(),
            getNginxConfigTemplatePath(),
            config);
        return writeFile(
            getConfigPath(),
            JSON.stringify(config),
            { encoding: "ascii", flag: "w+" });
    }
}

function getConfigPath() {
    return app.getPath("userData") + "/" + "config.json";
}

export function getNginxConfigPath() {
    return app.getPath("userData") + "/" + "nginx.conf";
}

function getNginxConfigTemplatePath() {
    return normalize(__dirname + "/../res/nginx-default.conf");
}

export interface Config {
    listenPort: number;
    nginxPath: string;
    services: {
        name: string;
        enabled: boolean;
        fmsURL: string;
        streamKey: string;
    }[];
}
