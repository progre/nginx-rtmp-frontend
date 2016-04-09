/// <reference path="../typings/main.d.ts" />
try { require("source-map-support").install(); } catch (e) { /* empty */ }
require("crash-reporter").start();
const app: any = require("app");
import {visitor} from "./service/gafactory";
import * as log4js from "log4js";
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
