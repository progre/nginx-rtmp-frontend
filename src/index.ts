try { require("source-map-support").install(); } catch (e) { /* empty */ }
const log4js = require("log4js");
import {app, BrowserWindow} from "electron";
import {visitor} from "./service/gafactory";
import Application from "./application";

log4js.configure({
    appenders: [{ type: "console", layout: { type: "basic" } }]
});

Application.new()
    .catch(e => {
        log4js.getLogger().fatal(e);
        visitor.exception(e).send();
        app.quit();
    });
