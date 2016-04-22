import * as fs from "fs";
import * as promisify from "native-promisify";
const NginxConfFile = require("nginx-conf").NginxConfFile;
const create = promisify(NginxConfFile.create);

export async function write(
    configPath: string,
    configTemplatePath: string,
    config: Config
) {
    await new Promise((resolve, reject) =>
        fs.createReadStream(configTemplatePath)
            .pipe(fs.createWriteStream(configPath))
            .once("error", reject)
            .once("close", resolve));
    let conf = await create(configPath);
    if (conf.nginx == null) {
        throw new Error();
    }
    conf.nginx.rtmp.server.listen._value = config.listenPort;
    for (let service of config.services) {
        if (!service.enabled) {
            continue;
        }
        this.container._add("push", `${service.fmsURL} playpath=${service.streamKey}`);
    }
    conf.flush();
    conf.die(configPath);
}

interface Config {
    listenPort: number;
    services: {
        enabled: boolean;
        fmsURL: string;
        streamKey: string;
    }[];
}
