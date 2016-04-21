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
        require("dialog").showMessageBox({ message: "test", buttons: ["test"] });
        throw new Error();
    }
    conf.nginx.rtmp.server.listen._value = config.listenPort;
    require("dialog").showMessageBox({ message: "1", buttons: ["test"] });
    for (let service of config.services) {
    require("dialog").showMessageBox({ message: "2" + service, buttons: ["test"] });
    require("dialog").showMessageBox({ message: "2" + service.enabled + service.fmsURL + service.streamKey == null, buttons: ["test"] });
        if (!service.enabled) {
            continue;
        }
        this.container._add("push", `${service.fmsURL} playpath=${service.streamKey}`);
    }
    require("dialog").showMessageBox({ message: "2", buttons: ["test"] });
    conf.flush();
    require("dialog").showMessageBox({ message: "3", buttons: ["test"] });
    conf.die(configPath);
    require("dialog").showMessageBox({ message: "4", buttons: ["test"] });
}

interface Config {
    listenPort: number;
    services: {
        enabled: boolean;
        fmsURL: string;
        streamKey: string;
    }[];
}
