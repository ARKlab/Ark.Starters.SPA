var Task = require("data.task");
var R = require("ramda");
var Promise = require("bluebird");
var msRestAzure = require("ms-rest-azure");
var request = require("request-promise");
var tedious = require("tedious");
var ManagementClient = require("auth0").ManagementClient;
var DbRequest = require("../Request/Request").DbRequest;

var auth0Settings = JSON.parse(
  process.env["APPSETTING_K4View.Admin.auth0-private"]
);

var auth0 = new ManagementClient(R.omit(["connection"], auth0Settings));

var types = tedious.TYPES;
var transactionUtils = require("./transactionUtils");
var resultHandler = transactionUtils.resultHandler;
var wrapInTransaction = transactionUtils.wrapInTransaction;

function addToGroup(token, user) {
  return Promise.all(
    R.map(function (group) {
      return request({
        url: graphTenant + "/groups/" + group.id + "/$links/members",
        qs: {
          "api-version": 1.6,
        },
        method: "post",
        headers: {
          authorization: "Bearer " + token,
        },
        json: true,
        body: {
          url: graphTenant + "/users/" + user.objectId,
        },
      });
    }, groups)
  );
}

function addAppRoleAssignment(token, user) {
  return Promise.all(
    R.map(function (assignment) {
      return request({
        url: graphTenant + "/users/" + user.objectId + "/appRoleAssignments",
        qs: {
          "api-version": 1.6,
        },
        method: "post",
        headers: {
          authorization: "Bearer " + token,
        },
        json: true,
        body: R.merge(assignment, { principalId: user.objectId }),
      });
    }, assignmentObjects)
  );
}

function userCreation(object, token) {
  return request({
    url: graphTenant + "/users/",
    qs: {
      "api-version": 1.6,
    },
    method: "post",
    headers: {
      authorization: "Bearer " + token,
    },
    body: R.pick(
      [
        "accountEnabled",
        "userPrincipalName",
        "displayName",
        "mailNickname",
        "passwordProfile",
        "givenName",
        "surname",
        "department",
        "extension_15490bfbed3b40bdb1bf8ce52787e49e_expiryDate",
      ],
      object
    ),
    json: true,
  });
}

function userUpdate(token, user, updates) {
  return request({
    url: graphTenant + "/users/" + user.objectId,
    qs: {
      "api-version": 1.6,
    },
    method: "patch",
    headers: {
      authorization: "Bearer " + token,
    },
    body: R.pick(["telephoneNumber", "otherMails"], updates),
    json: true,
  });
}

function createAndAssignUser(user) {
  return Promise.resolve(user)
    .then(
      R.pick(["email", "username", "password", "user_metadata", "app_metadata"])
    )
    .then(
      R.merge({
        email_verified: true,
        connection:
          auth0Settings.connection || "Username-Password-Authentication",
      })
    )
    .then(auth0.createUser);
}

function deleteUserTypeMapping(req) {
  return function (connection) {
    return new Task(function (reject, resolve) {
      var request = new tedious.Request(
        `delete FROM [dbo].[K2E_User_Type_Mapping] where UserType = @userType`,
        resultHandler(reject, resolve, connection)
      );
      request.addParameter("userType", types.Int, req.body.userType);
      connection.execSql(request);
    });
  };
}

function insertUserMapping(req) {
  return function (connection) {
    return new Task(function (reject, resolve) {
      var bulk = connection.newBulkLoad(
        "K2E_User_Type_Mapping",
        resultHandler(reject, resolve, connection)
      );
      bulk.addColumn("Name", types.NVarChar, {
        nullable: false,
      });
      bulk.addColumn("UserType", types.Int, {
        nullable: true,
      });
      req.body.users.forEach(function (val) {
        bulk.addRow({
          Name: val,
          UserType: req.body.userType,
        });
      });
      connection.execBulkLoad(bulk);
    });
  };
}

function updateUserMapping(req) {
  var userList = R.pathOr([], ["body","users"], req)
  if(userList.length > 0)
  { 
    var requestComposition = R.composeK(
      insertUserMapping(req),
      deleteUserTypeMapping(req)
    );
    return wrapInTransaction(requestComposition);
}
  
}
const getExpiredGroup = DbRequest.Create(
  "Select [ID] from [K2E_User_Types] where Name = 'Expired'"
)
  .getExecuter()
  .chain((x) =>
    x[0] ? Task.of(x[0]) : Task.rejected("Expired Group not found")
  )
  .map((x) => x.ID);

const moveUsersToGroup = (users) => (groupId) => {
  const userList = users.map((_, i) => `@user${i}`).join(",");

  const request = DbRequest.Create(
    `Update [K2E_User_Type_Mapping] set [UserType] = @groupId where [Name] in (${userList})`
  );
  request.AddParameter("groupId", types.Int, groupId);

  users.forEach((val, i) => {
    request.AddParameter(`user${i}`, types.NVarChar, val);
  });

  return request.getExecuter();
};

const moveUsersToExpired = (users) =>
  getExpiredGroup.chain(moveUsersToGroup(users));

function getAllUsers(user) {
  return Promise.resolve(user)
    .then(
      R.merge({
        search_engine: "v3",
        connection:
          auth0Settings.connection || "Username-Password-Authentication",
      })
    )
    .then(auth0.getUsers);
}

function getUserById(id) {
  return Promise.resolve(id)
    .then(
      R.merge({
        search_engine: "v3",
        connection:
          auth0Settings.connection || "Username-Password-Authentication",
      })
    )
    .then(auth0.getUser);
}

function updateUserInfo(id, b) {
  return Promise.resolve(id)
        .then(function () {
          return auth0.updateUser(
            {
              id: id,
            },
            R.omit(["user_id", "artesian_expiry_date"], b)
          );
        });
}

module.exports = {
  updateUserMapping: updateUserMapping,
  createAndAssignUser: createAndAssignUser,
  moveUsersToExpired,
  getAllUsers: getAllUsers,
  getUserById: getUserById,
  updateUserInfo: updateUserInfo,
};
