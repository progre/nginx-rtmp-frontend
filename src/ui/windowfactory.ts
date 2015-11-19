const BrowserWindow = require('browser-window');
import * as path from 'path';

export function mainWindow() {
    let win = new BrowserWindow({
        width: 800,
        height: 800,
        resizable: true,
        show: false,
        'skip-taskbar': true
    });
    win.loadUrl(path.normalize(`file://${__dirname}/../public/index.html`));
    return win;
}
