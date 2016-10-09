import { Menu, Tray } from "electron";
import * as path from "path";
import { EventEmitter } from "events";

export default class TrayIcon extends EventEmitter {
    private tray = createTray();

    constructor() {
        super();

        this.tray.setContextMenu(this.createMenu(false));
        this.tray.on("click", () => this.emit("click"));
    }

    set running(value: boolean) {
        this.tray.setContextMenu(this.createMenu(value));
    }

    private createMenu(running: boolean) {
        return Menu.buildFromTemplate([
            {
                label: running ? "nginx 実行中" : "nginx 停止中",
                enabled: false
            },
            { type: "separator" },
            {
                label: "設定", click: () => this.emit("config")
            },
            {
                label: "終了", click: () => this.emit("quit")
            }
        ]);
    }
}

function createTray() {
    let resourcePath = path.normalize(__dirname + "/res");
    let tray = new Tray(process.platform === "darwin"
        ? resourcePath + "/icon_16px@3x.png"
        : resourcePath + "/icon_192px.png");
    tray.setToolTip("nginx-rtmp-frontend");
    return tray;
}
