/// <reference path="./typings.d.ts" />
const eRequire = require;
const remote = eRequire('remote');

$(() => {
    console.log('hoge1')
    let mainProcess = remote.getGlobal('mainProcess');
    let config = mainProcess.config;
    // await new Promise((resolve, reject) => {
    //     console.log('hoge2')
    //     resolve();
    // });
    // let [a, b, c] = [1,2,3];
    console.log('hoge3')
    
    let path = config.exePath;
    $('#nginx-path')
        .val(path)
        .change(function() {
            console.log(config.exePath);
            config.exePath = $(this).val();
            console.log(config.exePath);
        });
    // addEventListener('blue', () => {
    //     mainProcess.save();
    // });
});
