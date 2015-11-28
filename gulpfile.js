'use strict';
const promisify = require('native-promisify');
const mkdir = promisify(require('fs').mkdir);
const exec = promisify(require('child_process').exec);
const sep = require('path').sep;
const gulp = require('gulp');
const del = require('del');
const runSequence = require('run-sequence');
const electronPackager = promisify(require('electron-packager'));

require('./gulp/copy')();
require('./gulp/jade')();
require('./gulp/stylus')();
require('./gulp/test')();
require('./gulp/ts')();

gulp.task('default', ['build', 'watch']);

gulp.task('release-build-and-test', ['release-build'], callback => {
    runSequence('test', callback);
});

gulp.task('build', ['clean'], callback => {
    runSequence('copy:copy', 'jade:build', 'stylus:build', 'ts', callback);
});

gulp.task('release-build', ['clean'], callback => {
    runSequence('copy:copy', 'jade:release', 'stylus:release', 'ts:release', callback);
});

gulp.task('clean', () => {
    return del('lib/');
});

gulp.task('ts', callback => {
    runSequence('ts:build', 'test', callback);
});

gulp.task('watch', () => {
    gulp.watch(['src/**/*', '!**/tsconfig.json', '!**/*.*(jade|stylus|ts|tsx)'], ['copy:copy']);
    gulp.watch(['src/**/*.ts', '!src/test/'], ['ts']);
    gulp.watch('src/**/*.jade', ['jade:build']);
    gulp.watch('src/**/*.stylus', ['stylus:build']);
    gulp.watch('src/test/**/*.ts', ['test']);
});

gulp.task('package', () => {
    const APP_NAME = require('./package.json').name;
    const ELECTRON_VER = '0.35.1';
    return mkdir('tmp').catch(errorHandler)
        .then(() => mkdir('tmp/dest')).catch(errorHandler)
        .then(() => exec('cp -r lib/ tmp/dest/lib')).then(printStdout)
        .then(() => exec('cp LICENSE tmp/dest/')).then(printStdout)
        .then(() => exec('cp package.json tmp/dest/')).then(printStdout)
        .then(() => exec('cp README*.md tmp/dest/')).then(printStdout)
        .then(() => exec('npm install --production', { cwd: 'tmp/dest' })).then(printStdout)
        .then(() => execPackageAndZip('tmp', 'dest', 'darwin', 'x64', 'src/res/icon.icns'))
        .then(() => execPackageAndZip('tmp', 'dest', 'win32', 'ia32', 'src/res/icon_256.ico'))
        .then(() => execPackageAndZip('tmp', 'dest', 'linux', 'x64', null));

    function execPackageAndZip(cwd, path, platform, arch, icon) {
        let os = (() => {
            switch (platform) {
                case 'darwin': return 'osx';
                case 'win32': return 'win';
                case 'linux': return 'linux';
            }
        })();
        let zipPath = `tmp/${APP_NAME}-${platform}-${arch}`;
        return electronPackager(
            {
                dir: `${cwd}/${path}`,
                name: APP_NAME,
                platform,
                arch,
                version: ELECTRON_VER,
                icon,
                asar: true,
                out: cwd
            })
            .then(printStdout)
            .then(() => exec(`zip -qry ../../${APP_NAME}-${os}.zip .`, { cwd: zipPath }))
            .then(printStdout);
    }

    function errorHandler(e) {
        if (e.code !== 'EEXIST') {
            throw e;
        }
    }

    function printStdout(stdout) {
        if (stdout.length > 0) {
            console.log(stdout);
        }
    }
});
