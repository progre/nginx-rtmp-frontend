var package = require('./package.json');

module.exports = grunt => {
    grunt.initConfig({
        'create-windows-installer': {
            ia32: {
                appDirectory: `./${package.name}-win32-ia32`,
                outputDirectory: './installer32',
                authors: 'progre',
                name: package.name.replace(/-/g, '_'),
                exe: `${package.name}.exe`
            }
        }
    });

    grunt.loadNpmTasks('grunt-electron-installer');
};
