module.exports = {
  server: process.env["APPSETTING_K4View.Admin.DbServer"],
  authentication: {
    type: 'default',
    options: {
      userName: process.env["APPSETTING_K4View.Admin.DbUser"],
      password: process.env["APPSETTING_K4View.Admin.DbPassword"]
    }
  },
  options: {
    encrypt: true,
    trustServerCertificate: false,
    database: process.env["APPSETTING_K4View.Admin.Db"],
    rowCollectionOnRequestCompletion: false,
    packetSize: 3276800,
    cryptoCredentialsDetails: {
      minVersion: 'TLSv1.2',
      maxVersion: 'TLSv1.2'
    },
    connectTimeout: 15000,
    requestTimeout: 30000,
    cancelTimeout: 5000,
    enableArithAbort: true
  },
  nlogConnectionString: process.env["SQLAZURECONNSTR_NLog.Database"],
  ArtesianAdmin: {
    ApiKey: process.env["APPSETTING_Artesian.Admin.Api.Key"],
    BaseUri: process.env["APPSETTING_Artesian.Admin.Api.Base.Uri"],
    CreateGroup: {
      Route: process.env["APPSETTING_Artesian.Admin.Api.CreateGroup.Route"],
      Code: process.env["APPSETTING_Artesian.Admin.Api.CreateGroup.Code"]
    },
    UpdateGroup: {
      Route: process.env["APPSETTING_Artesian.Admin.Api.UpdateGroup.Route"],
      Code: process.env["APPSETTING_Artesian.Admin.Api.UpdateGroup.Code"]
    },
    ACLPathUpdater: {
      Route: process.env["APPSETTING_Artesian.Admin.Api.ACLPathUpdater.Route"],
      Code: process.env["APPSETTING_Artesian.Admin.Api.ACLPathUpdater.Code"]
    }
  }
}
