var express = require("express");
var router = express.Router();
var DbUtil = require("../Request/Request");
var request = DbUtil.DbRequest;
var connect = DbUtil.GetConnection;
var tedious = require("tedious");
var types = tedious.TYPES;
var mustbe = require("mustbe").routeHelpers();
var userUtil = require("../utils/userUtils");
var R = require("ramda");
var email = require("mailer");
var mailConstants = require("./constants");
var AdminRequests = require("../ArtesianAdmin/AdminRequests");

router.use("/", mustbe.authorized("admin"));
router.get("/", function(req, res, next) {
  request
    .Create("Select * from [K2E_User_Type_Mapping]")
    .getExecuter()
    .fork(next, data => res.json(data));
});

router.post("/", function(req, res, next) {
  userUtil
    .createAndAssignUser({
      password: req.body.userPassword,
      email: req.body.userEmail,
      user_metadata: {
        phone_number: req.body.userPhone,
        name: req.body.userName + " " + req.body.userSurname,
        given_name: req.body.userName,
        family_name: req.body.userSurname
      },
      app_metadata: {
        company: req.body.userCompany,
        expiry_date: req.body.userExpiryDate
      }
    })
    .then(function(user) {
      res.json({
        generatedEmail: user.email,
        displayName: user.user_metadata.name
      });
    })
    .catch(function(err) {
      res
        .status(err.statusCode)
        .send(R.pathOr("Could not create user", ["message"], err));
    });
});

router.post("/email", function(req, res) {
  //TODO clean up
  var templateFolder = process.env.runLocal ? "Backend/" : "";
  var templatePath = "../" + templateFolder + "templates/email-template.txt";

  email.send(
    {
      host: "smtps.aruba.it",
      domain: "smtps.aruba.it",
      port: "465",
      ssl: true,
      to: req.body.userEmail,
      bcc: "support@k4view.com",
      from: "security-officer@k4view.com",
      subject: "New K4View Portal User Credential",
      template: templatePath,
      data: {
        Subject: "New K4View Portal User Credential",
        MailText:
          "Welcome to your K4View Portal. Attached is a file with your credentials.",
        Signature: "K4View Security"
      },
      authentication: "login",
      username: "info@k4view.com",
      password: "|KkI<?CJ4",
      attachments: [
        {
          filename: "Security.pdf",
          contents: Buffer.from(req.body.pdf, "base64")
        },
        {
          filename: "k4viewcropped.png",
          contents: new Buffer(mailConstants.K4ViewLogoBase64, "base64"),
          cid: "k4viewlogo"
        }
      ]
    },
    function(err, result) {
      if (err) {
        res.status(400).send(err);
      } else res.send("Sent");
    }
  );
});

router.get("/:type", function(req, res, next) {
  request
    .Create("Select * from [K2E_User_Type_Mapping] where UserType = @type")
    .AddParameter("type", types.Int, req.params.type)
    .getExecuter()
    .fork(next, data => res.json(data));
});

router.get("/user/:user", function(req, res, next) {
  request
    .Create("Select * from [K2E_User_Type_Mapping] where Name = @user")
    .AddParameter("user", types.NVarChar, req.params.user)
    .getExecuter()
    .fork(next, data => res.json(data));
});

router.post("/update", function(req, res, next) {
  var updater = userUtil.updateUserMapping(req);
  updater(connect())
    .chain(() =>
      AdminRequests.updateGroup({
        name: req.body.groupName,
        users: req.body.users
      })
    )
    .fork(next, () => res.send("ok"));
});

module.exports = router;
