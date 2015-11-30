/// <reference path="./typings.d.ts" />
import Server from './server';
const SERVICES = ['twitch', 'peercaststation', 'cavetube', 'livecodingtv', 'niconico'];

new Promise(
    (resolve, reject) =>
        $(resolve))
    .then(() => Promise.all<any>([
        new Promise(
            (resolve, reject) =>
                i18n.init({ lng: navigator.language }, resolve))
            .then(() => {
                $('[class*=i18n-]').each((i, elem) => {
                    let key = elem.className
                        .split(' ')
                        .filter(x => x.indexOf('i18n-') === 0)[0]
                        .slice('i18n-'.length);
                    $(elem).text(i18n.t(key));
                });
            })
    ]))
    .then(() => {
        $('#copy')
            .click(() => {
                $('#fms').select();
                document.execCommand('copy');
            });

        let server = Server.create();
        addEventListener('blur', () => {
            server.save();
        });
        addEventListener('unload', () => {
            server.save();
        });
        $('#nginx-path')
            .val(server.config.exePath)
            .change(function() {
                server.config.exePath = $(this).val();
                setActiveToRestartButton();
            });
        $('#select-button')
            .click(() => {
                server.showOpenDialog()
                    .then(fileName => {
                        if (fileName == null) {
                            return;
                        }
                        server.config.exePath = fileName;
                        setActiveToRestartButton();
                        $('#nginx-path').val(fileName);
                    });
            });
        $('#port')
            .val(server.nginxConfig.port())
            .change(function() {
                let port = $(this).val();
                if (port == null) {
                    port = 1935;
                }
                server.nginxConfig.setPort(port);
                updateFms();
                setActiveToRestartButton();
            });
        $('#twitch-fms').append(
            server.ingests
                .sort((a, b) =>
                    a.name === b.name ? 0 : a.name < b.name ? -1 : 1)
                .map(x =>
                    $('<option>')
                        .val((<string>x.url_template).replace('/{stream_key}', ''))
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
                .prop(enabled ? 'checked' : '', 'checked')
                .change(function() {
                    if ($(this).prop('checked')) {
                        $(`#${x}-check`).show();
                        server.nginxConfig.enable(x);
                    } else {
                        $(`#${x}-check`).hide();
                        server.nginxConfig.disable(x);
                    }
                    setActiveToRestartButton();
                });
            $(`#${x}-fms`)
                .val(server.nginxConfig.fms(x))
                .change(function() {
                    server.nginxConfig.setFms(x, $(this).val());
                    setActiveToRestartButton();
                });
            $(`#${x}-key`)
                .val(server.nginxConfig.key(x))
                .change(function() {
                    server.nginxConfig.setKey(x, $(this).val());
                    setActiveToRestartButton();
                });
        });
        $('#restart-button')
            .click(function() {
                $(this)
                    .removeClass('btn-primary')
                    .addClass('btn-secondary');
                $('#restart-message').hide();
                server.restart();
            });
        updateFms();
        showOption('twitch');
        $('#root').fadeIn('fast');
    })
    .catch(e => {
        console.error(e);
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
