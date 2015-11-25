/// <reference path="./typings.d.ts" />
'use strict';
try { require('source-map-support').install(); } catch (e) { /* empty */ }
require('crash-reporter').start();
const app = require('app');
const autoUpdater = require('auto-updater');
import * as https from 'https';
import promisify from 'native-promisify';
import * as log4js from 'log4js';
const logger = log4js.getLogger();
const GitHubApi = require('github');
import Application from './application';

log4js.configure({
    appenders: [{
        type: 'console',
        layout: { type: 'basic' }
    }]
});

function main() {
    let squirrelCommand = process.argv[1];
    switch (squirrelCommand) {
        case '--squirrel-install':
        case '--squirrel-updated':
            return;
        case '--squirrel-uninstall':
            return;
        case '--squirrel-obsolete':
            return;
        default:
    }

    checkUpdate().catch(e => {
        log4js.getLogger().fatal(e);
        app.quit();
    });
    Application.new().catch(e => {
        log4js.getLogger().fatal(e);
        app.quit();
    });
}

async function checkUpdate() {
    let github = new GitHubApi({
        version: '3.0.0',
        debug: false
    });
    let json = <any[]>await promisify(github.releases.listReleases)({
        owner: 'progre',
        repo: 'nginx-rtmp-frontend'
    });
    let latest = json.filter(x => !x.draft && !x.prerelease)
        .filter(x => (<any[]>x.assets)
            .filter((x: any) => x.name === 'update.json')
            .length > 0)[0];
    // if (latest.tag_name === app.getVersion()) {
    //     setTimeout(checkUpdate, 24 * 60 * 60 * 1000);
    //     return;
    // }
    let url = latest.assets.filter((x: any) => x.name === 'update.json')[0].browser_download_url;
    logger.info(url);
    autoUpdater.setFeedURL(url);
    autoUpdater.on('update-not-available', () => {
        logger.info('update-not-available');
    });
    autoUpdater.on('update-available', () => {
        logger.info('update-available');
    });
    autoUpdater.on('update-downloaded', () => {
        logger.info('update-downloaded');
        app.on('quit', () => {
            logger.info('quit!');
            (<any>autoUpdater).quitAndInstall();
        });
    });
    autoUpdater.checkForUpdates();
    // const releaseURL = 'https://api.github.com/repos/progre/nginx-rtmp-frontend/releases';
    // https.get(releaseURL, res => {
    //     logger.info('asdf', res.statusCode);
    //     res.setEncoding('utf-8');
    //     let json = <any[]>JSON.parse(res.read());
    //     logger.info('', json);
    // });
}

main();
