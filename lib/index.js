var PATH = require('path');

var U = require('express-bem/lib/util');

var enbServerMiddleware = require('enb/lib/server/server-middleware');
var dropRequireCache = require('enb/lib/fs/drop-require-cache');

module.exports = {
    middleware: middleware,
    middlewares: [middleware]
};

function middleware(opts) {
    var that = this; // express-bem

    opts = opts || {};
    opts.env = opts.env || this.env;
    opts.cdir = opts.cdir || opts.root || this.projectRoot;
    opts.noLog = 'noLog' in opts ? opts.noLog :
        typeof opts.verbosity === 'boolean' ? !opts.verbosity :
        (opts.verbosity === 'error' && opts.verbosity !== 'debug');

    var enbBuilder = enbServerMiddleware.createBuilder(opts);

    return function (ctx, next) {
        var engine = this.engines.byExtension(this.ext);
        var relBundlePath = PATH.relative(opts.cdir, ctx.name);
        var bundleName = PATH.basename(ctx.name);
        var bemjsonName = PATH.join(relBundlePath, bundleName + '.bemjson.js');

        var targets = [];
        var targetExtensions = (engine.targetExtensions || [engine.extension]);
        if (targetExtensions.length) {
            // build only declared techs/exts
            targetExtensions.forEach(function (ext) {
                targets.push(PATH.join(relBundlePath, bundleName + ext));
            });

        } else {
            // can't build all
            next();
        }

        // dafuq.
        // enbBuilder({targets: targets}, function (err, data) {
        //     next();
        // });

        var count = targets.length;
        targets.forEach(function (target) {
            enbBuilder(target).always(function (promise) {
                // console.log(promise.valueOf());
                if (!(--count)) {
                    next();
                }
            });
        });

    };
}
