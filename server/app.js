var express = require("express");
var cors = require("cors");
var path = require("path");
var favicon = require("serve-favicon");
var winston = require("winston");
var expressWinston = require("express-winston");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var addRequestId = require("express-request-id");
var logger = require("./logger")(__filename);

var createCheckJwt = require("./auth/createCheckJwt");
var checkApiKey = require("./auth/checkApiKey");
var mustBe = require("mustbe");
var mustBeConfig = require("./mustbe-config");
mustBe.configure(mustBeConfig);

var users = require("./routes/users");
var userTypes = require("./routes/userTypes");
var usersInfo = require("./routes/usersInfo");
var artesianAdmin = require("./routes/artesianAdmin");

var app = express();
var router = express.Router();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors());
app.use(addRequestId());

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
app.use(cookieParser());

// In production (Azure) serve the Vite build output; locally Vite dev server handles static files
if (process.env.WEBSITE_SITE_NAME)
  app.use(express.static(path.join(__dirname, "../build")));

app.use(
  expressWinston.logger({
    transports: [
      new winston.transports.Console({
        json: false,
        colorize: false,
      }),
      new winston.transports.CustomLogger("Express"),
    ],
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: "HTTP {{req.method}} {{req.url}} {{req.id}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: false, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute: function (req, res) {
      return false;
    }, // optional: allows to skip some log messages based on request and/or response
  })
);

app.use(router);

var auth0Config = JSON.parse(process.env["APPSETTING_K4View.Admin.auth0"]);
router.use(
  createCheckJwt({
    auth0Domain: auth0Config.domain,
    audience: auth0Config.clientID,
  })
);
router.use("/users", users);
router.use("/userTypes", userTypes);
router.use("/usersInfo", usersInfo);
router.use("/artesianAdmin", checkApiKey, artesianAdmin);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function (err, req, res, next) {
    logger.error(err);
    res.status(err.status || 500);
    res.render("error", {
      message: err.message || err,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  logger.error(err);
  res.status(err.status || 500);
  res.render("error", {
    message: err.message || err,
    error: err,
  });
});

module.exports = app;
