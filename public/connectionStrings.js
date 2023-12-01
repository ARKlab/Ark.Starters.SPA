var http = require("http");
var port = process.env.port;

http
  .createServer(function (req, res) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        clientID: process.env["AzureAdB2C_ClientId"],
        domain: process.env["AzureAdB2C_Domain"],
        scopes: process.env["AzureAdB2C_Scopes"],
        knownAuthorities: process.env["AzureAdB2C_Instance"],
        signUpSignInPolicyId: process.env["AzureAdB2C_SignUpSignInPolicyId"],
        serviceUrl: "randomserviceurl.com",
      })
    );
  })
  .listen(port);
