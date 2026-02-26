var _ = require("underscore");
_.extend(process.env, {
  "runLocal": "true",
  "APPSETTING_K4View.Admin.serverRoot": "http://localhost:3000",
  "APPSETTING_K4View.Admin.adminRoot": "/",
  "APPSETTING_K4View.Admin.DbUser": "svc_K4ViewTest",
  "APPSETTING_K4View.Admin.DbPassword": "1669ShadeGlassWavesGuessSeeds7320",
  "APPSETTING_K4View.Admin.DbServer": "k4viewtest.database.windows.net",
  "APPSETTING_K4View.Admin.Db": "K4View_Users",
  "APPSETTING_K4View.Admin.connectionStringsUrl":
    "https://k4view-portal-test-k2e.azurewebsites.net/",
  "SQLAZURECONNSTR_NLog.Database":
    "data source=k4viewtest.database.windows.net,1433;initial catalog=Logs;persist security info=True;user id=svc_K4ViewTest;password=1669ShadeGlassWavesGuessSeeds7320;",
"APPSETTING_K4View.Admin.auth0": JSON.stringify({
    domain: "k2e.eu.auth0.com",
    clientID: "Fqj5AVrNuBIlsKTSIHJz967sa0t1r5IM",
    responseType: "token id_token",
    redirectUri: "http://localhost:3000",
    scope: "openid profile email"
  }),
  "APPSETTING_K4View.Admin.auth0-private": JSON.stringify({
    domain: "k2e.eu.auth0.com",
    clientId: "CAqpFIXQRepqNxni4wRPCMlOHEzgiNcU",
    clientSecret: "1kLThip_A_5xlqJQmjqn_m_3jp_3oY9hpPTMVQfRqjNjuDPKgua1xBZvPcvkhgkS",
    connection: "TEST-K4View",
    scope: "read:users update:users"
  }),
  "APPSETTING_Artesian.Admin.Api.Key": "testkey",
  "APPSETTING_Artesian.Admin.Api.Base.Uri":
    "https://k4view-artesian-useradmin-test.azurewebsites.net/api/",
  "APPSETTING_Artesian.Admin.Api.CreateGroup.Route": "CreateGroup",
  "APPSETTING_Artesian.Admin.Api.CreateGroup.Code":
    "TZg718DHw0dwgUF07hJFAp655h2hJZsPJHCcuGw1TIDfEj0spDwDAA==",
  "APPSETTING_Artesian.Admin.Api.UpdateGroup.Route": "UpdateGroup",
  "APPSETTING_Artesian.Admin.Api.UpdateGroup.Code":
    "wamllBk/R5/yhF3fCO6UfUblWDzx1XzVT5BEltNQ/c0pTusZT5F1wQ==",
  "APPSETTING_Artesian.Admin.Api.ACLPathUpdater.Route": "ACLPathUpdater",
  "APPSETTING_Artesian.Admin.Api.ACLPathUpdater.Code":
    "53wRM2frI1nP5YgV5aCefsjUBsiHMLWIZ4FUU88xv8T3szS2MCRvEw==",
});
