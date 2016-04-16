/// <reference path="../../../typings/browser.d.ts" />
import "babel-polyfill";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as i18n from "i18next";
const XHR = require("i18next-xhr-backend");
const Cache = require("i18next-localstorage-cache");
import * as sprintf from "i18next-sprintf-postprocessor";
const LanguageDetector = require("i18next-browser-languagedetector");
import Root, {Props} from "./component/root";
import Server from "./server";
import {ServiceConfig} from "./domain/domains";
const eRequire = require;
const remote = eRequire("electron").remote;
const Menu = remote.Menu;
const SERVICES = ["twitch", "peercaststation", "cavetube", "livecodingtv", "niconico", "other"];

async function main() {
    await new Promise((resolve, reject) =>
        $(resolve));
    await new Promise((resolve, reject) =>
        i18n.use(XHR)
            .use(Cache)
            .use(LanguageDetector)
            .use(sprintf)
            .init(
            {
                backend: {
                    loadPath: "./locales/{{lng}}/{{ns}}.json"
                },
                lng: navigator.language
            },
            resolve));
    let server = Server.create();
    let root = ReactDOM.render(
        React.createElement(Root, <Props>{
            initialState: {
                nginxPath: server.config.exePath,
                port: server.config.exePath,
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
                root.setState({ nginxPath: fileName });
            },
            onNginxPathChange: path => {
                server.config.exePath = path;
                root.setState({ nginxPath: path });
            },
            onPortChange: port => {
                if (port == null || Number.isNaN(port)) {
                    port = 1935;
                }
                server.nginxConfig.setPort(port);
                root.setState({ port });
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
                });
            },
            onFMSChange: (service, value) => {
                server.nginxConfig.setFms(service, value);
                root.setState({
                    serviceConfigs: updateServiceConfig(
                        root.state.serviceConfigs,
                        service,
                        { fms: value }),
                    needRestart: true
                });
            },
            onStreamKeyChange: (service, value) => {
                server.nginxConfig.setKey(service, value);
                root.setState({
                    serviceConfigs: updateServiceConfig(
                        root.state.serviceConfigs,
                        service,
                        { key: value }),
                    needRestart: true
                });
            },
            onRestart: () => {
                server.restart();
                root.setState({ needRestart: true });
            }
        }),
        document.getElementsByTagName("main")[0]);
    $("[class*=i18n-]").each((i, elem) => {
        let key = elem.className
            .split(" ")
            .filter(x => x.indexOf("i18n-") === 0)[0]
            .slice("i18n-".length);
        $(elem).html(i18n.t(key));
    });
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
