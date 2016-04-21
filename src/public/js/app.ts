/// <reference path="../../../typings/browser.d.ts" />
import "babel-polyfill";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as i18n from "i18next";
const XHR = require("i18next-xhr-backend");
const LanguageDetector = require("i18next-browser-languagedetector");
const remote = (<any>window).require("electron").remote;
const Menu = remote.Menu;
import Root, {Props} from "./component/root";
import {ServiceConfig} from "./domain/domains";
import Browser from "../../service/browser";

async function main() {
    await Promise.all([
        new Promise(resolve => {
            document.addEventListener(
                "DOMContentLoaded",
                function onDOMContentLoaded() {
                    document.removeEventListener(
                        "DOMContentLoaded",
                        onDOMContentLoaded);
                    resolve();
                });
        }),
        new Promise((resolve, reject) =>
            i18n.use(XHR)
                .use(LanguageDetector)
                .init(
                {
                    backend: { loadPath: "./locales/{{lng}}/{{ns}}.json" },
                    lng: navigator.language
                },
                resolve))
    ]);
    let browser = getBrowser();
    let config = await browser.getConfig();
    let root = ReactDOM.render(
        React.createElement(Root, <Props>{
            initialState: {
                nginxPath: config.nginxPath,
                port: config.listenPort,
                needRestart: false,
                serviceConfigs: config.services.map(x => ({
                    name: x.name,
                    enabled: x.enabled,
                    fms: x.fmsURL,
                    key: x.streamKey
                }))
            },
            twitchIngests: browser.twitchIngests
                .sort((a, b) =>
                    a.name === b.name ? 0 : a.name < b.name ? -1 : 1)
                .map(x => ({
                    name: x.name,
                    url: (<string>x.url_template).replace("/{stream_key}", "")
                })),
            onNginxPathSelectorLaunch: async () => {
                let fileName = await browser.showOpenDialog();
                if (fileName == null) {
                    return;
                }
                browser.setConfig(Object.assign(
                    await browser.getConfig(),
                    { nginxPath: fileName }));
                root.setState({ nginxPath: fileName });
            },
            onNginxPathChange: async (path) => {
                browser.setConfig(Object.assign(
                    await browser.getConfig(),
                    { nginxPath: path }));
                root.setState({ nginxPath: path });
            },
            onPortChange: async (port) => {
                if (port == null || Number.isNaN(port)) {
                    port = 1935;
                }
                browser.setConfig(Object.assign(
                    await browser.getConfig(),
                    { listenPort: port }));
                root.setState({ port });
            },
            onEnabledChange: async (service, value) => {
                let config = await browser.getConfig();
                config.services
                    .filter(x => x.name === service)[0].enabled = value;
                browser.setConfig(config);
                root.setState({
                    serviceConfigs: updateServiceConfig(
                        root.state.serviceConfigs,
                        service,
                        { enabled: value }),
                    needRestart: true
                });
            },
            onFMSChange: async (service, value) => {
                let config = await browser.getConfig();
                config.services
                    .filter(x => x.name === service)[0].fmsURL = value;
                browser.setConfig(config);
                root.setState({
                    serviceConfigs: updateServiceConfig(
                        root.state.serviceConfigs,
                        service,
                        { fms: value }),
                    needRestart: true
                });
            },
            onStreamKeyChange: async (service, value) => {
                let config = await browser.getConfig();
                config.services
                    .filter(x => x.name === service)[0].streamKey = value;
                browser.setConfig(config);
                root.setState({
                    serviceConfigs: updateServiceConfig(
                        root.state.serviceConfigs,
                        service,
                        { key: value }),
                    needRestart: true
                });
            },
            onRestart: () => {
                browser.restart();
                root.setState({ needRestart: false });
            }
        }),
        document.getElementsByTagName("main")[0]);
    initShortcutKey();
    initUI();
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

function initUI() {
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

function getBrowser() {
    return <Browser>remote.getGlobal("browser");
}

main().catch(e => {
    console.error(e);
    throw e;
});
