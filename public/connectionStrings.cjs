var http = require("http");
var port = process.env.PORT;

require("dotenv").config({ path: [`.env.${process.env.NODE_ENV}.local`, `.env.${process.env.NODE_ENV}`, ".env.local", ".env"] });


http
  .createServer(function (req, res) {
    res.writeHead(200, { "Content-Type": "text/javascript" });

    const appSettings = {
      msal: process.env["MSAL_ClientId"] ? {
        clientId: process.env["MSAL_ClientId"],
        domain: process.env["MSAL_Domain"],
        authority: process.env["MSAL_Authority"],
        redirectUri: process.env["MSAL_RedirectUri"],
        knownAuthorities: process.env["MSAL_KnownAuthorities"],
        scopes: process.env["MSAL_Scopes"],
      } : undefined,
      auth0: process.env["AUTH0_ClientId"] ? {
        clientID: process.env["AUTH0_ClientId"],
        domain: process.env["AUTH0_Domain"],
        audience: process.env["AUTH0_Audience"],
        redirectUri: process.env["AUTH0_RedirectUri"],
      } : undefined,
      serviceUrl: "randomserviceurl.com",
      applicationInsights: process.env["APPLICATIONINSIGHTS_CONNECTION_STRING"] ? {
        connectionString: process.env["APPLICATIONINSIGHTS_CONNECTION_STRING"],
      } : undefined
    };

    res.end(`
      window.appSettings = ${JSON.stringify(appSettings)};
    `);
  })
  .listen(port);