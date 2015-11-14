const app = require('app');
const Tray = require('tray');
const Menu = require('menu');
import * as path from 'path';
import {EventEmitter} from 'events';

export default class TrayIcon extends EventEmitter {
    private tray = createTray();

    constructor() {
        super();

        this.tray.setContextMenu(this.createMenu());
    }

    private createMenu() {
        return Menu.buildFromTemplate([
            {
                label: '終了', click: () => this.emit('quit')
            }
        ]);
    }
}

function createTray() {
    let resourcePath = path.normalize(__dirname + '/../res');
    let tray: GitHubElectron.Tray;
    if (process.platform === 'darwin') {
        tray = new Tray(resourcePath + '/icon_16px@2x.png');
    } else {
        tray = new Tray(resourcePath + '/icon_192px.png');
    }
    tray.setToolTip('nginx-rtmp-frontend');
    return tray;
}
