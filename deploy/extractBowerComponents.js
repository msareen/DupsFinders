//Install dependency

(function () {
    'use strict';

    var fs = require('fs');
    var path = require('path');
    var ncp = require('ncp').ncp;

    ncp.limit = 4;

    function extractBowerComponents(isMin, externalPath) {
        console.log('extracting bower components...');
        let bowerPackageJsonFile = path.join(__dirname, '/../bower.json');
        fs.readFile(bowerPackageJsonFile, (err, data) => {
            if (!err) {
                let bowerObj = JSON.parse(data);
                for (let propertyName in bowerObj.dependencies) {
                    copyClientDependency(propertyName, isMin, externalPath);
                }
            } else {
                console.log('can\'t access ' + bowerPackageJsonFile);
            }
        });
    }


    function copyClientDependency(name, isMin, clientExternalDepPath) {
        let bowerComponentPath = path.join(__dirname, '/../bower_components/', name);
        let bowerComponentDist = path.join(bowerComponentPath, '/dist');

        fs.access(clientExternalDepPath, fs.constants.R_OK | fs.constants.W_OK, (err) => {
            if (!err) {
                let disPath = fs.existsSync(bowerComponentDist) ? bowerComponentDist : bowerComponentPath;
                fs.readdir(disPath, (err, files) => {
                    console.log('copying files...');
                    console.log(files);
                    if (err) {
                        console.error(err);
                        return;
                    }
                    ncp(disPath, path.join(clientExternalDepPath, name), (err) => {
                        if (err) {
                            console.error(err);
                        }
                    });
                });
            } else {
                console.error('Error Create path ' + clientExternalDepPath);
            }
        });
    }

    module.exports = extractBowerComponents;

})();
