(function () {

    var http = require('http');
    var fs = require('fs');


    function downloadWebDependency( uri, downloadPath ) {
        console.log('download web dependency from ' + uri);
        http.get(uri, (res) => {
        const statusCode = res.statusCode;
        const contentType = res.headers['content-type'];

        let error;

        if (statusCode !== 200) {
            error = new Error('Request Failed.\n' +
                'Status Code: ${statusCode}');
        }

        if (error) {
            console.log(error.message);
            // consume response data to free up memory
            res.resume();
            return;
        }

        res.setEncoding('utf8');
        let rawData = '';

        res.on('data', (chunk) => rawData += chunk);
        res.on('end', () => {
            try {
                fs.writeFile(downloadPath, rawData, (err) => {
                   if(err) {
                       console.log('error writing to path ' + downloadPath );
                       throw err;
                   }

                });
            } catch (e) {
                console.log(e.message);
            }
        });
        }).on('error', (e) => {
            console.log('Got error: ${e.message}');

        });
    }

    module.exports = downloadWebDependency;

})();
