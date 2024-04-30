var http = require("http");
var port = process.env.port;

if (process.env.NODE_ENV === "development") {
  require("dotenv").config({ path: ".env.local" });
}

/*
http
  .createServer(function (req, res) {
    res.writeHead(200, { "Content-Type": "text/javascript" });
    res.end(`
      window.customSettings = {
        clientID: "${process.env["MSAL_ClientId"]}",
        domain: "${process.env["MSAL_Domain"]}",
        scopes: "${process.env["MSAL_Scopes"]}",
        authority: "${process.env["MSAL_authority"]}",
        knownAuthorities: "${process.env["MSAL_knownAuthorities"]}",
        redirectUri: "${process.env["MSAL_RedirectUri"]}",
        serviceUrl: "randomserviceurl.com",
      };
    `);
  })
  .listen(port);
  */

/* MSAL2 */

http
  .createServer(function (req, res) {
    res.writeHead(200, { "Content-Type": "text/javascript" });
    res.end(`
      window.customSettings = {
        clientID: "${process.env["MSAL_ClientId"]}",
        domain: "${process.env["MSAL_Domain"]}",
        scopes: "${process.env["MSAL_Scopes"]}",
        authority: "${process.env["MSAL_Authority"]}",
        knownAuthorities: "${process.env["MSAL_KnownAuthorities"]}",
        redirectUri: "${process.env["MSAL_RedirectUri"]}",
        serviceUrl: "randomserviceurl.com",
      };
    `);
  })
  .listen(port);
// */

/* AUTH0 
http
  .createServer(function (req, res) {
    res.writeHead(200, { "Content-Type": "text/javascript" });
    res.end(`
      window.customSettings = {
        clientID: "${process.env["AUTH0_ClientId"]}",
        domain: "${process.env["AUTH0_Domain"]}",
        audience: "${process.env["AUTH0_Audience"]}",
        redirectUri: "${process.env["AUTH0_RedirectUri"]}",
        serviceUrl: "randomserviceurl.com",
      };
    `);
  })
  .listen(port);

*/
