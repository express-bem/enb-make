var PATH = require('path');

var U = require('express-bem/lib/util');

var MakePlatform = require('enb/lib/make');
var dropRequireCache = require('enb/lib/fs/drop-require-cache');

module.exports = {
    middleware: middleware,
    middlewares: [middleware]
};

function middleware(opts) {
    var that = this; // express-bem

    opts = opts || {};
    opts.env = opts.env || this.env;
    opts.root = PATH.resolve(opts.cdir || opts.root || this.projectRoot);
    opts.noLog = 'noLog' in opts ? opts.noLog :
        typeof opts.verbosity === 'boolean' ? !opts.verbosity :
        (opts.verbosity === 'error' && opts.verbosity !== 'debug');

    var makePlatform = new MakePlatform();

    return function (ctx, next) {
        var engine = this.engines.byExtension(this.ext);
        var relBundlePath = PATH.relative(opts.root, ctx.name);
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
            // can't build nothing
            next();
        }

        makePlatform.init(opts.root, opts.env).then(function () {
            if (opts.noLog) {
                makePlatform.getLogger().setEnabled(false);
            }
            makePlatform.loadCache();
            makePlatform.buildTargets(targets).always(function () {
                makePlatform.saveCache();
                makePlatform.destruct();
                next();
            });
        });

    };
}
