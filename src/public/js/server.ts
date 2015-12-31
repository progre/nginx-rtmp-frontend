import * as _os from "os";
const eRequire = require;

export default class Server {
    private os: typeof _os = eRequire("os");
    private remote = eRequire("remote");
    private dialog: typeof GitHubElectron.Dialog = this.remote.require("dialog");
    private mainProcess = this.remote.getGlobal("mainProcess");
    config = this.mainProcess.config;
    nginxConfig = this.mainProcess.nginxConfig;
    ingests: any[] = this.mainProcess.ingests;

    static create() {
        if ((<any>window).process == null) {
            return <Server>{ /* tslint:disable:no-empty */
                config: {},
                nginxConfig: {
                    enabled() { }, enable() { }, disable() { },
                    port() { }, setPort() { },
                    fms() { }, setFms() { },
                    key() { }, setKey() { }
                },
                ingests: [{
                    name: "Asia: Tokyo, Japan",
                    availability: 1,
                    _id: 65,
                    default: false,
                    url_template: "rtmp://live-tyo.twitch.tv/app/{stream_key}"
                }],
                showOpenDialog() { },
                save() { },
                restart() { }
            }; /* tslint:enable */
        }
        return new this();
    }

    showOpenDialog() {
        return new Promise<string>((resolve, reject) => {
            let filters = this.os.platform() === "win32"
                ? [{ name: "nginx.exe", extensions: ["exe"] }]
                : [];
            this.dialog.showOpenDialog(
                { filters },
                fileNames => resolve(fileNames == null ? null : fileNames[0]));
        });
    }

    save() {
        this.mainProcess.save();
    }

    restart() {
        this.mainProcess.restart();
    }
}
