//Dups Hash Generator
/*
Copyright (c) 2017  Manasvi Sareen (manasvi.sareen@live.com)
MIT License 
*/

const crypto = require('crypto');
const fs = require('fs');
const q = require('q');
const path = require('path');
const _ = require('lodash');


var hashObjects = {
    isHashGeneated : false
};

var progress = null;

function onProgress( callback ) {
    progress = callback;
}

function generateHash( dirName ) {
    var defered = q.defer();
    dirWalker( dirName , function (err, results) {
        if (err) {
            console.log(err);
            deferred.reject( err );
        } else {
            progress( 'found ' + results.length + ' files' );
            consolidateHash(results).then((hashMap) => {
                fullHashMap = hashMap;
                var dupes = _.filter(hashMap, (item) => {
                    return item.count > 1
                });
                hashObjects.isHashGeneated = true;
                hashObjects.fullHashMap = hashMap;
                hashObjects.dupsHashMap = dupes;
                defered.resolve( hashObjects );
            });
        }
    });
    return defered.promise;
}



function consolidateHash( files ) {
    var defered = q.defer();
    var progressCounter = 0;
    var hashMap = {};
    files.forEach((file) => {
        getHash(file).then((checksum) => {
                progressCounter++;
                process.stdout.clearLine();
                process.stdout.cursorTo(0);
                var progressPercentage = ((progressCounter / files.length) * 100).toFixed(1);
                var message = 'Progress: ' + progressPercentage + '% - file : ' + progressCounter + '/' + files.length;
                process.stdout.write( message );
                progress ( message );
                if (!hashMap[checksum]) {
                    hashMap[checksum] = {
                        count: 1,
                        files: [file]
                    };
                } else {
                    hashMap[checksum].count++;
                    hashMap[checksum].files.push(file);
                }

                if (progressCounter === files.length) {
                    console.log('resolving hashmap');
                    defered.resolve(hashMap);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    });
    return defered.promise;
}


//Asyn Directory walker
function dirWalker(dir, callback) {
    var results = [];
    fs.stat(dir, (err, stats) => {
        if (err) {
            return callback(err);
        }
        if (stats.isDirectory()) {
            fs.readdir(dir, (err, files) => {
                var pending = files.length;
                if (!pending) return callback(null, results);
                files.forEach((file) => {
                    file = path.join(dir, file);
                    fs.stat(file, (err, stats) => {
                        if (err) {
                            console.log('error :' + err);
                            return callback(err);
                        }
                        if (stats.isDirectory()) {
                            dirWalker(file, function (err, res) {
                                results = results.concat(res);
                                if (!--pending) callback(null, results);
                            });
                        } else {
                            results.push(file);
                            if (!--pending) callback(null, results);
                        }
                    })
                })
            })
        }
    })
}

//Generate has for a file
function getHash(file) {
    var defered = q.defer();
    var stream = fs.ReadStream(file);
    var shasum = crypto.createHash('sha1');
    stream.on('data', function (data) {
        shasum.update(data);
    })

    stream.on('end', function () {
        var hash = shasum.digest('hex')
        defered.resolve(hash);
    })
    return defered.promise;
}

exports.filesHashGenerator =  { generateHash, onProgress };
