var express = require("express");
var router = express.Router();
var request = require("../Request/Request").DbRequest;
var types = require("tedious").TYPES;
var mustbe = require("mustbe").routeHelpers();
var AdminRequests = require("../ArtesianAdmin/AdminRequests");
var R = require("ramda");

var flatComponentList = R.pipe(
  JSON.parse,
  R.prop("menuItem"),
  R.chain(R.pathOr([], ["childItem", "childLinks"])),
  R.chain(R.prop("components")),
  R.map(R.prop("componentType")),
  R.sortBy(x => x)
);
router.use("/", mustbe.authorized("admin"));
router.get("/", function(req, res, next) {
  request
    .Create("Select * from [K2E_User_Types]")
    .getExecuter()
    .fork(next, data => res.json(data));
});
router.get("/get/:id", function(req, res, next) {
  request
    .Create("Select * from [K2E_User_Types] where id = @id")
    .AddParameter("id", types.Int, req.param.id)
    .getExecuter()
    .fork(next, data => res.json(data));
});
router.get("/getName/:name", function(req, res, next) {
  request
    .Create("Select * from [K2E_User_Types] where Name = @name")
    .AddParameter("name", types.NVarChar, req.param.name)
    .getExecuter()
    .fork(next, data => res.json(data));
});
router.post("/delete/:id", function(req, res, next) {
  request
    .Create("delete from [K2E_User_Types] where id = @id")
    .AddParameter("id", types.Int, req.params.id)
    .getExecuter()
    .fork(next, () => res.send("ok"));
});
router.post("/create/:name", function(req, res, next) {
  request
    .Create("insert into [K2E_User_Types] values(@name,'')")
    .AddParameter("name", types.NVarChar, req.params.name)
    .getExecuter()
    .chain(() => AdminRequests.createGroup(req.params.name))
    .fork(next, () => res.send("ok"));
});
router.post("/updateName", function(req, res, next) {
  request
    .Create("update [K2E_User_Types] set Name= @name where id = @id")
    .AddParameter("name", types.NVarChar, req.body.Name)
    .AddParameter("id", types.Int, req.body.ID)
    .getExecuter()
    .fork(next, () => res.send("ok"));
});
router.post("/update", function(req, res, next) {
  request
    .Create(
      "update [K2E_User_Types] set  Config = @config, Name= @name where id = @id"
    )
    .AddParameter("name", types.NVarChar, req.body.Name)
    .AddParameter("config", types.NVarChar, req.body.Config)
    .AddParameter("id", types.Int, req.body.ID)
    .getExecuter()
    .chain(() =>
      AdminRequests.updateGroupAcl({
        Name: req.body.Name,
        Components: isArtesianSelected(req.body.Config)
          ? flatComponentList(req.body.Config)
          : []
      })
    )
    .fork(next, () => res.send("ok"));
});
module.exports = router;

function isArtesianSelected(jsonString) {
  return JSON.parse(jsonString).menuItem.find(x => x.reportId === "artesian")
    ? true
    : false;
}
