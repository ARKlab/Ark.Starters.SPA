var http = require("http");
var port = process.env.PORT;

// Load environment files based on both NODE_ENV and VITE_MODE
// This ensures we load the correct .env file for both Vite builds and standalone server
const mode = process.env.VITE_MODE || process.env.NODE_ENV;
const envFiles = [`.env.${mode}.local`, `.env.${mode}`, `.env.local`, ".env"];

require("dotenv").config({ path: envFiles });

http
  .createServer(function (req, res) {
    res.writeHead(200, { "Content-Type": "text/javascript" });

    const appSettings = {
      msal: process.env["MSAL_ClientId"]
        ? {
            clientId: process.env["MSAL_ClientId"],
            domain: process.env["MSAL_Domain"],
            authority: process.env["MSAL_Authority"],
            redirectUri: process.env["MSAL_RedirectUri"],
            knownAuthorities: process.env["MSAL_KnownAuthorities"],
            scopes: process.env["MSAL_Scopes"],
          }
        : undefined,
      auth0: process.env["AUTH0_ClientId"]
        ? {
            clientID: process.env["AUTH0_ClientId"],
            domain: process.env["AUTH0_Domain"],
            audience: process.env["AUTH0_Audience"],
            redirectUri: process.env["AUTH0_RedirectUri"],
          }
        : undefined,
      serviceUrl: "randomserviceurl.com",
      applicationInsights: process.env["APPLICATIONINSIGHTS_CONNECTION_STRING"]
        ? {
            connectionString: process.env["APPLICATIONINSIGHTS_CONNECTION_STRING"],
          }
        : undefined,
    };

    res.end(`
      window.appSettings = ${JSON.stringify(appSettings)};
    `);
  })
  .listen(port);
