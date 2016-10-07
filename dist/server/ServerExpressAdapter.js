'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _ServerInterface2 = require('./ServerInterface');

var _ServerInterface3 = _interopRequireDefault(_ServerInterface2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ServerExpressAdapter = function (_ServerInterface) {
    _inherits(ServerExpressAdapter, _ServerInterface);

    function ServerExpressAdapter(config, container, routeLoader, middlewareLoader, logger) {
        _classCallCheck(this, ServerExpressAdapter);

        var _this = _possibleConstructorReturn(this, (ServerExpressAdapter.__proto__ || Object.getPrototypeOf(ServerExpressAdapter)).call(this));

        _this._express = (0, _express2.default)();
        _this._config = config;
        _this._container = container;
        _this._middlewareLoader = middlewareLoader;
        _this._routeLoader = routeLoader;
        _this._logger = logger;
        _this._route = [];
        return _this;
    }

    _createClass(ServerExpressAdapter, [{
        key: 'getServer',
        value: function getServer() {
            return this._express;
        }
    }, {
        key: 'getConfig',
        value: function getConfig() {
            return this._config;
        }
    }, {
        key: 'getRoute',
        value: function getRoute() {
            return this._route;
        }
    }, {
        key: 'getContainer',
        value: function getContainer() {
            return this._container;
        }
    }, {
        key: 'boot',
        value: function boot() {
            this._initializeConfig();
            this._run();
        }
    }, {
        key: '_run',
        value: function _run() {
            var _this2 = this;

            this._express.listen(this._config.server.port, function () {
                _this2._logger.info('Server started [' + _this2._config.server.domain + '][' + _this2._config.server.port + ']');
            });
        }
    }, {
        key: '_initializeConfig',
        value: function _initializeConfig() {
            var routes = this._config.routes;
            var middlewareStack = this._config.middleware_stack;

            for (var key in routes) {
                this._route.push(routes[key].path);
                this._routeLoader.register(this._express, routes[key]);
            }

            for (var _key in middlewareStack) {
                this._middlewareLoader.register(this._express, middlewareStack[_key]);
            }
        }
    }]);

    return ServerExpressAdapter;
}(_ServerInterface3.default);

exports.default = ServerExpressAdapter;