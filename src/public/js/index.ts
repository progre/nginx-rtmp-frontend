import * as React from "react";
import * as ReactDOM from "react-dom";
import * as i18n from "i18next";
const XHR = require("i18next-xhr-backend");
const LanguageDetector = require("i18next-browser-languagedetector");
import Root, { Props } from "./component/root";
import Server from "./server";
import { ServiceConfig } from "./domain/domains";
const remote = (<any>window).require("electron").remote;
const Menu = remote.Menu;
const SERVICES = ["twitch", "peercaststation", "cavetube", "livecodingtv", "niconico", "other"];

async function main() {
    await Promise.all([
        new Promise(resolve => {
            document.addEventListener("DOMContentLoaded", function onDOMContentLoaded() {
                document.removeEventListener("DOMContentLoaded", onDOMContentLoaded);
                resolve();
            });
        }),
        new Promise((resolve, reject) =>
            i18n.use(XHR)
                .use(LanguageDetector)
                .init(
                {
                    backend: {
                        loadPath: "./locales/{{lng}}/{{ns}}.json"
                    },
                    lng: navigator.language
                },
                resolve))
    ]);
    let server = Server.create();
    let root = ReactDOM.render(
        React.createElement(Root, <Props>{
            initialState: {
                nginxPath: server.config.exePath,
                port: server.config.port,
                needRestart: false,
                serviceConfigs: SERVICES.map(x => ({
                    name: x,
                    enabled: server.nginxConfig.enabled(x),
                    fms: server.nginxConfig.fms(x),
                    key: server.nginxConfig.key(x)
                }))
            },
            twitchIngests: server.ingests
                .sort((a, b) =>
                    a.name === b.name ? 0 : a.name < b.name ? -1 : 1)
                .map(x => ({
                    name: x.name,
                    url: (<string>x.url_template).replace("/{stream_key}", "")
                })),
            onNginxPathSelectorLaunch: async () => {
                let fileName = await server.showOpenDialog();
                if (fileName == null) {
                    return;
                }
                server.config.exePath = fileName;
                root.setState({ nginxPath: fileName } as any);
            },
            onNginxPathChange: path => {
                server.config.exePath = path;
                root.setState({ nginxPath: path } as any);
            },
            onPortChange: port => {
                if (port == null || Number.isNaN(port)) {
                    port = 1935;
                }
                server.nginxConfig.setPort(port);
                root.setState({ port } as any);
            },
            onEnabledChange: (service, value) => {
                if (value) {
                    server.nginxConfig.enable(service);
                } else {
                    server.nginxConfig.disable(service);
                }
                root.setState({
                    serviceConfigs: updateServiceConfig(
                        root.state.serviceConfigs,
                        service,
                        { enabled: value }),
                    needRestart: true
                } as any);
            },
            onFMSChange: (service, value) => {
                server.nginxConfig.setFms(service, value);
                root.setState({
                    serviceConfigs: updateServiceConfig(
                        root.state.serviceConfigs,
                        service,
                        { fms: value }),
                    needRestart: true
                } as any);
            },
            onStreamKeyChange: (service, value) => {
                server.nginxConfig.setKey(service, value);
                root.setState({
                    serviceConfigs: updateServiceConfig(
                        root.state.serviceConfigs,
                        service,
                        { key: value }),
                    needRestart: true
                } as any);
            },
            onRestart: () => {
                server.restart();
                root.setState({ needRestart: false } as any);
            }
        }),
        document.getElementsByTagName("main")[0]);
    initShortcutKey();
    initUI(server);
}

function initShortcutKey() {
    let menu = Menu.buildFromTemplate([
        {
            label: "Copy",
            accelerator: "CmdOrCtrl+C",
            role: "copy"
        },
        {
            label: "Paste",
            accelerator: "CmdOrCtrl+V",
            role: "paste"
        },
        {
            label: "Cut",
            accelerator: "CmdOrCtrl+X",
            role: "cut"
        },
        {
            label: "Select All",
            accelerator: "CmdOrCtrl+A",
            role: "selectall"
        }
    ]);
    window.addEventListener(
        "contextmenu",
        e => {
            e.preventDefault();
            menu.popup(remote.getCurrentWindow());
        },
        false);
}

function initUI(server: Server) {
    addEventListener("blur", () => {
        server.save();
    });
    addEventListener("unload", () => {
        server.save();
    });
    let main = (<HTMLElement>document.getElementsByTagName("main")[0]);
    main.style.transition = "opacity 0.3s";
    main.style.opacity = "1";
}

function updateServiceConfig(
    serviceConfigs: ServiceConfig[],
    service: string,
    config: any
) {
    let list = serviceConfigs.concat();
    let idx = list.findIndex(x => x.name === service);
    list[idx] = Object.assign({}, list[idx], config);
    return list;
}

main().catch(e => {
    console.error(e);
    throw e;
});
