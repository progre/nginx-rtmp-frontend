'use strict';
const mkdir = require('native-promisify')(require('fs').mkdir);
const exec = require('native-promisify')(require('child_process').exec);
const gulp = require('gulp');
const del = require('del');
const runSequence = require('run-sequence');

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

gulp.task('copy-to-dest', () => {
    return mkdir('dest')
        .then(() => exec('cp -r lib/ dest/lib')).then(printStdout)
        .then(() => exec('cp LICENSE dest/')).then(printStdout)
        .then(() => exec('cp package.json dest/')).then(printStdout)
        .then(() => exec('cp README*.md dest/')).then(printStdout)
        .then(() => exec('npm install --production', { cwd: 'dest' })).then(printStdout);

    function printStdout(stdout) {
        if (stdout.length > 0) {
            console.log(stdout);
        }
    }
});
