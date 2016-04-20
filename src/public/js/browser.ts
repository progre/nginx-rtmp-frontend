import * as _os from "os";
const os: typeof _os = (<any>window).require("os");
const remote: Electron.Remote = (<any>window).require("remote");
const dialog: Electron.Dialog = remote.require("dialog");
const mainProcess = remote.getGlobal("mainProcess");
import {Config} from "../../service/repository";

export let ingests: any[] = mainProcess.ingests;

export function showOpenDialog() {
    return new Promise<string>((resolve, reject) => {
        let filters = os.platform() === "win32"
            ? [{ name: "nginx.exe", extensions: ["exe"] }]
            : [];
        dialog.showOpenDialog(
            { filters },
            fileNames => resolve(fileNames == null ? null : fileNames[0]));
    });
}

export function getConfig() {
    
}

export function setConfig(value: Config) {

}

export function restart() {
    mainProcess.restart();
}
