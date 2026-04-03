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
var logger = require("../logger")(__filename);

function getQuery(q) {
  if (R.isEmpty(q) || R.isNil(q)) {
    return null;
  }
  return "name:" + q + "* OR email:" + q + "*";
}

router.use("/", mustbe.authorized("admin"));

function getUsers(info, userRes, res) {
  userUtil
    .getAllUsers(info)
    .then((response) => {
      const retrivedUsers = userRes.concat(response.users);
      console.log(info.page);
      if (retrivedUsers.length <= response.total) {
        const page = R.add(info.page, 1);
        const pageLimit = page === 9 ? 99 : 100;
        if (page === 10) {
          res.send(retrivedUsers);
        } else {
          getUsers(
            R.merge(info, { page: page, per_page: pageLimit }),
            retrivedUsers,
            res
          );
        }
      } else {
        res.send(retrivedUsers);
      }
    })
    .catch(function (err) {
      res
        .status(err.statusCode)
        .send(R.pathOr("Could not get all users", ["message"], err));
    });
}

// Search All Users
// Filter user by Name or Email using the query param user
// Example => /usersInfo?user=paul will return all users Paul
router.get("/", function (req, res, next) {
  getUsers(
    {
      page: 0,
      per_page: 100,
      search_engine: "v3",
      include_fields: true,
      include_totals: true,
      fields:
        "user_id,email,username,name,user_metadata,app_metadata,given_name,family_name,blocked",
      q: getQuery(req.param("user")),
    },
    [],
    res
  );
});

// Search for specific user by ID
router.get("/:id", function (req, res, next) {
  userUtil
    .getUserById({
      id: decodeURIComponent(req.params.id),
    })
    .then(function (user) {
      res.send(user);
    })
    .catch(function (err) {
      res
        .status(err.statusCode)
        .send(R.pathOr("Could not get user", ["message"], err));
    });
});

// Unblock a specific user - sets blocked: false in Auth0
// Auth0 Management API rate limits: ~15 PATCH requests/sec; individual actions only, no bulk endpoint
router.patch("/:id/unblock", function (req, res, next) {
  var targetUserId = decodeURIComponent(req.params.id);
  // req.user.sub is the Auth0 user ID of the authenticated admin (set by JWT middleware)
  var adminId = R.pathOr("unknown", ["user", "sub"], req);

  userUtil
    .updateUserInfo(targetUserId, { blocked: false })
    .then(function (user) {
      logger.info("User unblocked", {
        req: req,
        message: "AUDIT | action=unblock_user | adminId=" + adminId + " | targetUserId=" + targetUserId,
        stack: null,
      });
      res.send(user);
    })
    .catch(function (err) {
      res
        .status(err.statusCode || 500)
        .send(R.pathOr("Could not unblock user", ["message"], err));
    });
});

// Update Users
// User ID required
// Sample Body
// {
//   user_metadata: {
//     phone_number: "123456789",
//     name: "Paul Conway",
//     given_name: "Paul",
//     family_name: "Conway 123",
//   },
//   app_metadata: {
//     company: "Ark",
//     expiry_date: "2031-01-01",
//   },
// };
router.post("/:id", function (req, res, next) {
  var targetUserId = decodeURIComponent(req.params.id);
  var adminId = R.pathOr("unknown", ["user", "sub"], req);

  userUtil
    .updateUserInfo(targetUserId, req.body)
    .then(function (user) {
      if (req.body.blocked === false) {
        logger.info("User unblocked", {
          req: req,
          message: "AUDIT | action=unblock_user | adminId=" + adminId + " | targetUserId=" + targetUserId,
          stack: null,
        });
      }
      res.send(user);
    })
    .catch(function (err) {
      res
        .status(err.statusCode)
        .send(R.pathOr("Could not update user", ["message"], err));
    });
});

module.exports = router;
