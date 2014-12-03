
var VM = require('vm');

var EXPRESS = require('express');
var REQUEST = require('request');

var EXPRESSBEM = require('express-bem');
var U = require('express-bem/lib/util');

global.expressSetup = expressSetup;
global.loadBemjson = loadBemjson;

function expressSetup(opts, before, after) {
    var env = {};

    before(function () {
        env.app = EXPRESS();

        env.app.bem = EXPRESSBEM(opts).bindTo(env.app);

        env.app.bem.usePlugin(require('express-bem-bh'));

        env.server = env.app.listen(function () {
            // store port to send requests later
            env.port = env.server.address().port;
        });
    });

    // stop listening after tests
    after(function () {
        env.server.close();
    });

    env.case = function (title, route, assert) {
        env.app.get(urlPath(title), route);
        REQUEST(url(title), assert);
    };

    function urlPath(title) {
        return '/' + U.md5(title);
    }

    function url(title) {
        return 'http://localhost:' + env.port + urlPath(title);
    }

    return env;
}

function loadBemjson(file, cb) {
    U.load(file, function (err, data) {
        var sandbox = {};
        var script = 'bemjson = ' + data;

        if (err) {
            cb(err);
            return;
        }

        try {
            VM.runInNewContext(script, sandbox, file + '.vm');
        } catch (e) {
            cb(e);
            return;
        }

        cb(null, sandbox.bemjson);
    });
}
