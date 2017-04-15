//gulp file
(function () {

    let gulp = require('gulp');
    let path = require('path');

    gulp.task('build', () => {
        let extractBowerComponents = require('./deploy/extractBowerComponents');
        let externalPath = path.join(__dirname, process.env.npm_package_config_clientExternalScriptsPath);
        console.log(externalPath);
        extractBowerComponents(false, externalPath);
    });

})();
