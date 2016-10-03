'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.logger = exports.MiddlewareInterface = exports.application = undefined;

var _yamlWithImport = require('yaml-with-import');

var _yamlWithImport2 = _interopRequireDefault(_yamlWithImport);

var _fsPromise = require('fs-promise');

var _fsPromise2 = _interopRequireDefault(_fsPromise);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _Container = require('./dependencyInjection/Container');

var _Container2 = _interopRequireDefault(_Container);

var _ServiceLoader = require('./dependencyInjection/ServiceLoader');

var _ServiceLoader2 = _interopRequireDefault(_ServiceLoader);

var _RouteLoader = require('./route/RouteLoader');

var _RouteLoader2 = _interopRequireDefault(_RouteLoader);

var _ServerExpressAdapter = require('./server/ServerExpressAdapter');

var _ServerExpressAdapter2 = _interopRequireDefault(_ServerExpressAdapter);

var _MiddlewareInterface = require('./middleware/MiddlewareInterface');

var _MiddlewareInterface2 = _interopRequireDefault(_MiddlewareInterface);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Logger = _winston2.default.Logger;
var container = new _Container2.default();
var yaml = new _yamlWithImport2.default();
var environment = process.env.NODE_ENV === 'production' ? 'prd' : process.env.NODE_ENV;
var rootDir = process.env.NODE_ROOT_PATH;
var configPath = rootDir + '/config/' + environment + '/config.yml';
var status = _fsPromise2.default.existsSync(configPath);

if (!status) {
    throw new Error('Config file not found ' + configPath);
}

var logger = new Logger({ transports: [new _winston2.default.transports.Console()] });
yaml.setRootPath(rootDir);
var config = yaml.read(configPath);
var serviceLoader = new _ServiceLoader2.default(container, config.services, logger);
var routerLoader = new _RouteLoader2.default(container, logger);
serviceLoader.setRootPath(rootDir);
serviceLoader.registerServices();
var server = new _ServerExpressAdapter2.default(config, container, routerLoader, logger);

exports.application = server;
exports.MiddlewareInterface = _MiddlewareInterface2.default;
exports.logger = logger;