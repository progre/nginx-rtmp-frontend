const eRequire = require;
const os = eRequire("os");
const remote = eRequire("electron").remote;
const dialog: Electron.Dialog = remote.require("electron").dialog;
const mainProcess = remote.getGlobal("mainProcess");

export default class Server {
    config = mainProcess.config;
    nginxConfig = mainProcess.nginxConfig;
    ingests: any[] = mainProcess.ingests;

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
        return new Promise<string | null>((resolve, reject) => {
            let filters = os.platform() === "win32"
                ? [{ name: "nginx.exe", extensions: ["exe"] }]
                : [];
            dialog.showOpenDialog(
                { filters },
                fileNames => resolve(fileNames == null ? null : fileNames[0]));
        });
    }

    save() {
        mainProcess.save();
    }

    restart() {
        mainProcess.restart();
    }
}
