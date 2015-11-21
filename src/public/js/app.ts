/// <reference path="./typings.d.ts" />
const eRequire = require;
const remote = eRequire('remote');
const dialog: typeof GitHubElectron.Dialog = remote.require('dialog');
import * as _os from 'os';
const os: typeof _os = eRequire('os');

$(() => {
    let mainProcess = remote.getGlobal('mainProcess');
    let config = mainProcess.config;
    $('#nginx-path')
        .val(config.exePath)
        .change(function() {
            console.log(config.exePath);
            config.exePath = $(this).val();
            console.log(config.exePath);
        });
    let filters = os.platform() === 'win32'
        ? [{ name: 'nginx.exe', extensions: ['exe'] }]
        : [];
    $('#select-button')
        .click(() => {
            dialog.showOpenDialog(
                {
                    filters
                },
                fileNames => {
                    if (fileNames == null) {
                        return;
                    }
                    $('#nginx-path').val(fileNames[0]);
                });
        });
    // addEventListener('blue', () => {
    //     mainProcess.save();
    // });
});
