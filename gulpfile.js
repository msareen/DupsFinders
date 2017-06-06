//gulp file
(function () {

    const gulp = require('gulp');
    const path = require('path');
    const colors = require('colors/safe');

    gulp.task('build', () => {
        let extractBowerComponents = require('./deploy/extractBowerComponents');
        if( !process.env.npm_package_config_clientExternalScriptsPath ) {
            console.log(colors.red('Error External path missing, please add config.clientExternalScriptsPath in package.json'));
            return;
        }
        let externalPath = path.join(__dirname, process.env.npm_package_config_clientExternalScriptsPath);
        console.log(externalPath);
        extractBowerComponents(false, externalPath);
    });

})();
