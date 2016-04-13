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
const eRequire = require;
const remote = eRequire("electron").remote;
const Menu = remote.Menu;
const SERVICES = ["twitch", "peercaststation", "cavetube", "livecodingtv", "niconico", "other"];

let root: Root;

async function main() {
    let server = Server.create();
    root = ReactDOM.render(
        React.createElement(Root, <Props>{
            onNginxPathSelectorLaunch: async () => {
                let fileName = await server.showOpenDialog()
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
            onRestart: () => {
                server.restart();
                root.setState({ needRestart: true });
            }
        }),
        document.getElementsByTagName("main")[0]);
    root.setState({
        nginxPath: server.config.exePath,
        port: server.config.exePath
    });
    await new Promise((resolve, reject) =>
        $(resolve));
    await new Promise((resolve, reject) =>
        i18n.use(XHR)
            .use(Cache)
            .use(LanguageDetector)
            .use(sprintf)
            .init({
                backend: {
                    loadPath: "./locales/{{lng}}/{{ns}}.json"
                },
                lng: navigator.language
            }, resolve));
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
    $("#twitch-fms").append(
        server.ingests
            .sort((a, b) =>
                a.name === b.name ? 0 : a.name < b.name ? -1 : 1)
            .map(x => ({
                name: x.name,
                url: (<string>x.url_template).replace("/{stream_key}", "")
            }))
            .map(x =>
                $("<option>")
                    .val(x.url)
                    .text(x.name)));
    SERVICES.forEach(x => {
        $(`#${x}-button`)
            .click(() => showOption(x));
        let enabled = server.nginxConfig.enabled(x);
        if (enabled) {
            $(`#${x}-check`).show();
        } else {
            $(`#${x}-check`).hide();
        }
        $(`#${x}-enabled`)
            .prop(enabled ? "checked" : "", "checked")
            .change(function() {
                if ($(this).prop("checked")) {
                    $(`#${x}-check`).show();
                    server.nginxConfig.enable(x);
                } else {
                    $(`#${x}-check`).hide();
                    server.nginxConfig.disable(x);
                }
                root.setState({ needRestart: true });
            });
        $(`#${x}-fms`)
            .val(server.nginxConfig.fms(x))
            .change(function() {
                server.nginxConfig.setFms(x, $(this).val());
                root.setState({ needRestart: true });
            });
        $(`#${x}-key`)
            .val(server.nginxConfig.key(x))
            .change(function() {
                server.nginxConfig.setKey(x, $(this).val());
                root.setState({ needRestart: true });
            });
    });
    showOption("twitch");
    $("#root").fadeIn("fast");
}

function showOption(service: string) {
    SERVICES.forEach(x => {
        $(`#${x}-option`).hide();
        $(`#${x}-button`)
            .removeClass("btn-primary")
            .addClass("btn-secondary");
    });
    $(`#${service}-button`)
        .removeClass("btn-secondary")
        .addClass("btn-primary")
        .blur();
    $(`#${service}-option`).show();
}

main().catch(e => {
    console.error(e);
    throw e;
});
