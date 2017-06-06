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
    isHashGeneated: false
};

var progress = null;
var isCanceled = false;

function onProgress(callback) {
    progress = callback;
}

function cancelProgress() {
    isCanceled = true;
    progress({
        progressPercentage: 0,
        message: 'cancelling...'
    });
}

function generateHash(dirName) {
    isCanceled = false;
    var defered = q.defer();
    progress({
        progressPercentage: 0,
        message: 'starting'
    });
    dirWalker(dirName, function (err, results) {
        if (err) {
            console.log(err);
            deferred.reject(err);
        } else {
            progress({
                progressPercentage: 0,
                message: '0% ' + '0/' + results.length
            });
            consolidateHash(results)
                .then((hashMap) => {
                    fullHashMap = hashMap;
                    var dupes = _.filter(hashMap, (item) => {
                        return item.count > 1
                    });
                    hashObjects.isHashGeneated = true;
                    hashObjects.fullHashMap = hashMap;
                    hashObjects.dupsHashMap = dupes;
                    progress({
                        progressPercentage: 100,
                        message: 'Completed'
                    })
                    if (isCanceled) {
                        process({
                            progressPercentage: 0,
                            message: 'canceled'
                        });
                        defered.resolve(null);
                    }
                    else {
                        defered.resolve(hashObjects);
                    }
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
        if(isCanceled) return;
        getHash(file).then((checksum) => {
            progressCounter++;
            var progressPercentage = ((progressCounter / files.length) * 100).toFixed(1);
            var message = progressPercentage + '% ' + progressCounter + '/' + files.length;
            writeOnConsole(message);
            progress({
                progressPercentage: progressPercentage,
                message: message
            });
            if (!hashMap[checksum]) {
                hashMap[checksum] = {
                    count: 1,
                    files: [file]
                };
            } else {
                hashMap[checksum].count++;
                hashMap[checksum].files.push(file);
                hashMap[checksum].files.push(path.basename(file));
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

function writeOnConsole(message) {
    if (!process.stdout.isTTY) {
        return;
    }
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(message);
}


//Async Directory walker
function dirWalker(dir, callback) {
    if (isCanceled) return;
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

//Generate hash for a file
function getHash(file) {
    if (isCanceled) return;
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

module.exports = { generateHash, onProgress, cancelProgress };
