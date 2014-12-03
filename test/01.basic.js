var ASSERT = require('assert');
var middleware = require('..').middleware;

describe('view render middlewares', function () {
    var bemjsonFile = './test/data/testing-project/desktop.bundles/index/index.bemjson.js';
    var env = global.expressSetup({
        projectRoot: 'test/data/testing-project'
    }, before, after);

    it('should call enb.make on render', function (done) {
        this.timeout(15000);

        // debugger;
        env.app.bem.use(middleware, {noLog: true});

        env.case(this.test.title, function (req, res) {
            global.loadBemjson(bemjsonFile, function (err, bemjson) {
                res.render('index', {bemjson: bemjson});
            });

        }, function (error, response, body) {
            ASSERT(body.indexOf('<!DOCTYPE') === 0);
            done();
        });

    });

});
