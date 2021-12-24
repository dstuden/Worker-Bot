const { request } = require('https'),
    Stream = require('stream').Transform

function fetch (path = '', options = {}) { return new Promise(function (resolve, reject) {
    var options = Object.assign({
        host: 'danbooru.donmai.us',
        path: '/' + path,
        port: '443',
        method: 'GET'
    }, options);

    function callback(response) {
        var data = new Stream();
        response.on('data', function (chunk) {
            data.push(chunk);
        });

        response.on('end', function () {
            resolve(data.read());
        });
    };

    var req = request(options, callback);

    req.on('error', function (err) {
        console.error(err.message);
            reject(err);
    })

    req.end();
})
}

module.exports = {
    fetch,
}