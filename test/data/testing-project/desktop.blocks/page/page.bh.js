module.exports = function (bh) {

    bh.match('page', function (ctx) {
        return [
            '<!DOCTYPE html>',
            ctx.content()
        ];
    });

};
