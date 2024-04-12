var http = require("http");
var port = process.env.port;

if (process.env.NODE_ENV === "development") {
  require("dotenv").config({ path: ".env.local" });
}

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
