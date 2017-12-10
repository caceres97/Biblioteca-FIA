'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressValidation = require('express-validation');

var _expressValidation2 = _interopRequireDefault(_expressValidation);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _routes = require('../routes');

var _routes2 = _interopRequireDefault(_routes);

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

var _expressPinoLogger = require('express-pino-logger');

var _expressPinoLogger2 = _interopRequireDefault(_expressPinoLogger);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
app.use((0, _expressPinoLogger2.default)());

// CORS OPTIONS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization, Accept");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  if ('OPTIONS' == req.method) {
    res.send(200);
  } else {
    next();
  }
});

app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: true }));

//We mount the routes folder (Using express router, refer to the docs)
app.use('/', _routes2.default);

//Handle all error types
app.use(function (err, req, res, next) {
  req.log.error(err.message);

  switch (err.constructor) {
    case _expressValidation2.default.ValidationError:
      res.status(500).json(err);
      break;

    case _sequelize2.default.ValidationError:
      res.status(422).json(err.errors);
      break;

    case _sequelize2.default.UniqueConstraintError:
      res.status(422).json(err.errors);
      break;

    case _jsonwebtoken2.default.JsonWebTokenError:
      res.status(400).json({ error: err.message });
      break;

    default:
      var status = err.status || 500;
      res.status(status).json({ status: err.status, message: err.message, errors: err.errors });
  }
});

exports.default = app;