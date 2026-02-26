const axios = require("axios");
const Task = require("data.task");
const { ArtesianAdmin } = require("../Request/config");

const {
  BaseUri,
  CreateGroup,
  UpdateGroup,
  ACLPathUpdater,
  ApiKey
} = ArtesianAdmin;

module.exports.createGroup = whenApiKey(
  ApiKey,
  group =>
    new Task(function(reject, resolve) {
      axios
        .post(
          `${BaseUri}${CreateGroup.Route}?group=${group}&code=${CreateGroup.Code}`
        )
        .then(resolve, reject);
    })
);

module.exports.updateGroup = whenApiKey(
  ApiKey,
  group =>
    new Task(function(reject, resolve) {
      axios
        .post(`${BaseUri}${UpdateGroup.Route}?code=${UpdateGroup.Code}`, group)
        .then(resolve, reject);
    })
);

module.exports.updateGroupAcl = whenApiKey(
  ApiKey,
  group =>
    new Task(function(reject, resolve) {
      axios
        .post(
          `${BaseUri}${ACLPathUpdater.Route}?code=${ACLPathUpdater.Code}`,
          group
        )
        .then(resolve, reject);
    })
);

function whenApiKey(key, fn) {
  return key ? fn : () => Task.resolve("Skip this environment");
}
