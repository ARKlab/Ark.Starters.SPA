var jwt = require("express-jwt");
var jwksRsa = require("jwks-rsa");

module.exports = function(options) {
  return jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: "https://" + options.auth0Domain + "/.well-known/jwks.json"
    }),
    audience: options.audience,
    issuer: "https://" + options.auth0Domain + "/",
    algorithms: ["RS256"]
  });
};
