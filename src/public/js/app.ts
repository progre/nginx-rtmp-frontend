/// <reference path="./typings.d.ts" />
const eRequire = require;
const remote = eRequire('remote');
const dialog: typeof GitHubElectron.Dialog = remote.require('dialog');
import * as _os from 'os';
const os: typeof _os = eRequire('os');
const SERVICES = ['twitch', 'peercaststation', 'cavetube', 'livecodingtv', 'niconico'];

$(() => {
    let mainProcess = remote.getGlobal('mainProcess');
    let config = mainProcess.config;
    let nginxConfig = mainProcess.nginxConfig;
    addEventListener('blur', () => {
        mainProcess.save();
    });
    addEventListener('unload', () => {
        mainProcess.save();
    });
    $('#copy')
        .click(() => {
            $('#fms').select();
            document.execCommand('copy');
        });
    $('#nginx-path')
        .val(config.exePath)
        .change(function() {
            config.exePath = $(this).val();
            setActiveToRestartButton();
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
                    let fileName = fileNames[0];
                    config.exePath = fileName;
                    setActiveToRestartButton();
                    $('#nginx-path').val(fileName);
                });
        });
    $('#port')
        .val(nginxConfig.port())
        .change(function() {
            let port = $(this).val();
            if (port == null) {
                port = 1935;
            }
            nginxConfig.setPort(port);
            updateFms();
            setActiveToRestartButton();
        });
    SERVICES.forEach(x => {
        $(`#${x}-button`)
            .click(() => showOption(x));
        let enabled = nginxConfig.enabled(x);
        if (enabled) {
            $(`#${x}-check`).show();
        } else {
            $(`#${x}-check`).hide();
        }
        $(`#${x}-enabled`)
            .prop(enabled ? 'checked' : '', 'checked')
            .change(function() {
                if ($(this).prop('checked')) {
                    $(`#${x}-check`).show();
                    nginxConfig.enable(x);
                } else {
                    $(`#${x}-check`).hide();
                    nginxConfig.disable(x);
                }
                setActiveToRestartButton();
            });
        $(`#${x}-fms`)
            .val(nginxConfig.fms(x))
            .change(function() {
                nginxConfig.setFms(x, $(this).val());
                setActiveToRestartButton();
            });
        $(`#${x}-key`)
            .val(nginxConfig.key(x))
            .change(function() {
                nginxConfig.setKey(x, $(this).val());
                setActiveToRestartButton();
            });
    });
    $('#restart-button')
        .click(function() {
            $(this)
                .removeClass('btn-primary')
                .addClass('btn-secondary');
            $('#restart-message').hide();
            mainProcess.restart();
        });
    updateFms();
    showOption('twitch');
});

function setActiveToRestartButton() {
    $('#restart-button')
        .removeClass('btn-secondary')
        .addClass('btn-primary');
    $('#restart-message').show();
}

function showOption(service: string) {
    SERVICES.forEach(x => {
        $(`#${x}-option`).hide();
        $(`#${x}-button`)
            .removeClass('btn-primary')
            .addClass('btn-secondary');
    });
    $(`#${service}-button`)
        .removeClass('btn-secondary')
        .addClass('btn-primary')
        .blur();
    $(`#${service}-option`).show();
}

function updateFms() {
    let port: string = $('#port').val();
    if (port == null || port === '' || port === '1935') {
        $('#fms').val(`rtmp://127.0.0.1/live`);
    } else {
        $('#fms').val(`rtmp://127.0.0.1:${port}/live`);
    }
}
