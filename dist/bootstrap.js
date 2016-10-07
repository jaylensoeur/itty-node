'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

var _MiddlerwareLoader = require('./middleware/MiddlerwareLoader');

var _MiddlerwareLoader2 = _interopRequireDefault(_MiddlerwareLoader);

var _ServerExpressAdapter = require('./server/ServerExpressAdapter');

var _ServerExpressAdapter2 = _interopRequireDefault(_ServerExpressAdapter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Bootstrap = function () {
    function Bootstrap() {
        _classCallCheck(this, Bootstrap);
    }

    _createClass(Bootstrap, null, [{
        key: 'invoke',
        value: function invoke() {
            var Logger = _winston2.default.Logger;
            var container = new _Container2.default();
            var yaml = new _yamlWithImport2.default();
            var environment = process.env.NODE_ENV === 'production' ? 'prd' : process.env.NODE_ENV;
            var rootDir = process.env.NODE_ROOT_PATH;

            if (!rootDir) {
                throw new Error('Missing NODE_ROOT_PATH environment variable');
            }

            var configPath = rootDir + '/config/' + environment + '/config.yml';
            var status = _fsPromise2.default.existsSync(configPath);

            if (!status) {
                throw new Error('Config file not found ' + configPath);
            }

            var logger = new Logger({ transports: [new _winston2.default.transports.Console()] });
            yaml.setRootPath(rootDir);
            var config = yaml.read(configPath);

            container.register('config', [], config);

            var serviceLoader = new _ServiceLoader2.default(container, config.services, logger);
            var routerLoader = new _RouteLoader2.default(container, logger);
            var middlewareLoader = new _MiddlerwareLoader2.default(container, logger);
            serviceLoader.setRootPath(rootDir);
            serviceLoader.registerServices();

            var server = new _ServerExpressAdapter2.default(config, container, routerLoader, middlewareLoader, logger);

            container.register('itty_node_server', [], server);

            return server;
        }
    }]);

    return Bootstrap;
}();

exports.default = Bootstrap;