const app = require("app");
import * as promisify from "native-promisify";
import * as fs from "fs";
const readFile = promisify(fs.readFile);
import Repository from "./repository";

/** v0.2.9からそれ以降のconfigへマイグレート */
export default async function migrate() {
    let config = await getConfig();
    if (config == null) {
        return;
    }
    if (config.exePath == null) {
        return;
    }
    let repo = await Repository.new();
    repo.setConfig({
        exePath: config.exePath
    });
}

async function getConfig() {
    try {
        let data = await readFile(getConfigPath(), "ascii");
        return JSON.parse(data);
    } catch (e) {
        return null;
    }
}

function getConfigPath() {
    return app.getPath("userData") + "/" + "config.json";
}

function getNginxConfigPath() {
    return app.getPath("userData") + "/" + "nginx.conf";
}
