module.exports = function(req, res) {
  var connectionStrings = {
    serverRoot: process.env["APPSETTING_K4View.Admin.serverRoot"],
    adminRoot: process.env["APPSETTING_K4View.Admin.adminRoot"],
    connectionStringsUrl: process.env["APPSETTING_K4View.Admin.connectionStringsUrl"],
    auth0: JSON.parse(process.env["APPSETTING_K4View.Admin.auth0"])
  };
  res.json(connectionStrings);
};
