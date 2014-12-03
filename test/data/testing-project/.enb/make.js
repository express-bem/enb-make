var techs = {
    // essential
    fileProvider: require('enb/techs/file-provider'),

    // bh
    bh: require('enb-bh/techs/bh-server'),
    htmlFromBemjson: require('enb-bh/techs/html-from-bemjson')
};
var enbBemTechs = require('enb-bem-techs');

module.exports = function (config) {
    config.nodes('*.bundles/*', function (nodeConfig) {
        nodeConfig.addTechs([
            // essential
            [enbBemTechs.levels, {levels: ['desktop.blocks']}],
            [techs.fileProvider, {target: '?.bemjson.js'}],
            enbBemTechs.bemjsonToBemdecl,
            enbBemTechs.deps,
            enbBemTechs.files,

            // bh
            [techs.bh, {
                jsAttrName: 'data-bem',
                jsAttrScheme: 'json',
                mimic: 'BEMHTML'
            }],
            techs.htmlFromBemjson
        ]);

        nodeConfig.addTargets(['?.html', '?.bh.js']);
    });
};
