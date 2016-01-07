const BrowserWindow = require("browser-window");
const shell = require("shell");
import * as path from "path";

export function createMainWindow() {
    let win = new BrowserWindow({
        width: 800,
        height: 800,
        resizable: true,
        show: false,
        "skip-taskbar": true
    });
    win.webContents.on("new-window", (e: any, url: string) => {
        shell.openExternal(url);
    });
    win.loadURL(path.normalize(`file://${__dirname}/../public/index.html`));
    return win;
}
