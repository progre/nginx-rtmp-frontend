/// <reference path="./typings.d.ts" />
'use strict';
try { require('source-map-support').install(); } catch (e) { /* empty */ }
require('crash-reporter').start();
import * as app from 'app';
import * as log4js from 'log4js';
import Application from './application';

log4js.configure({
    appenders: [{
        type: 'console',
        layout: { type: 'basic' }
    }]
});

async function main() {
    var squirrelCommand = process.argv[1];
    switch (squirrelCommand) {
        case '--squirrel-install':
        case '--squirrel-updated':
            app.quit();
            return;
        case '--squirrel-uninstall':
            app.quit();
            return;
        case '--squirrel-obsolete':
            app.quit();
            return;
    }

    try {
        await Application.new();
    } catch (e) {
        log4js.getLogger().fatal(e);
        app.quit();
    }
}

main();
