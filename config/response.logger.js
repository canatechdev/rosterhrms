const logger = require("./winston.logger");

function responseLogger(req, res, next) {
    const oldJson = res.json;
console.log("RESPONSE LOGGER HIT");
    res.json = function (data) {
        logger.info({
            route: req.originalUrl,
            method: req.method,
            response: data
        });

        return oldJson.call(this, data);
    };

    next();
}

module.exports = responseLogger;