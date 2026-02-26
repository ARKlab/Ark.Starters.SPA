var request = require("./Request/Request").DbRequest;
var types = require("tedious").TYPES;
var R = require("ramda");

module.exports = function(config) {
  config.routeHelpers(function(rh) {
    // get the current user from the request object
    rh.getUser(function(req, cb) {
      // return cb(err); if there is an error
      cb(null, req.user.email);
    });

    // what do we do when the user is not authorized?
    rh.notAuthorized(function(req, res) {
      res.status(401);
      res.send("unAuthorised");
    });
  });
  config.activities(function(activities) {
    activities.can("admin", function(identity, params, cb) {
      // now check if you're an admin. this may involve database
      // calls or other service calls.
      request
        .Create("Select * from [Admin_Users] where Name = @name")
        .AddParameter("name", types.NVarChar, identity.user)
        .getExecuter()
        .fork(
          () => cb("server error"),
          data => cb(null, R.pathOr(false, ["0", "IsAdmin"], data))
        );
    });
  });
};
