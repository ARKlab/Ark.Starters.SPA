const { ArtesianAdmin } = require("../Request/config");

module.exports = function(error, req, res, next) {
  if (!ArtesianAdmin.ApiKey)
    return next("Route not supported for this environment");

  if (!req.headers["x-api-key"]) return next("Need an api key for this route");

  if (req.headers["x-api-key"] !== ArtesianAdmin.ApiKey)
    return next("Api key is not correct");

  next();
};
