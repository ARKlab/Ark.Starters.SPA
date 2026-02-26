var express = require("express");
var userUtil = require("../utils/userUtils");

var router = express.Router();

router.post("/moveToExpired", function(req, res, next) {
  userUtil.moveUsersToExpired(req.body).fork(next, x => res.send("ok"));
});

module.exports = router;
