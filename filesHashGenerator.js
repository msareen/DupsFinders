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

function filesHashGenerator( dirName ) {
    var defered = q.defer();
    dirWalker( dirName , function (err, results) {
        if (err) {
            console.log(err);
        } else {
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



function consolidateHash(files) {
    var defered = q.defer();
    var progressCounter = 0;
    var hashMap = {};
    files.forEach((file) => {
        getHash(file).then((checksum) => {
                progressCounter++;
                process.stdout.clearLine();
                process.stdout.cursorTo(0);
                var progress = ((progressCounter / files.length) * 100).toFixed(1);
                process.stdout.write('Progress: ' + progress + '% - file : ' + progressCounter + '/' + files.length);
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

exports.filesHashGenerator = filesHashGenerator;