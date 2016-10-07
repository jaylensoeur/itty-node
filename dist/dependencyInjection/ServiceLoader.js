'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ServiceLoader = function () {
    function ServiceLoader(container, services, logger) {
        _classCallCheck(this, ServiceLoader);

        this._services = services;
        this._container = container;
        this._logger = logger;
        this._startPath = null;
    }

    _createClass(ServiceLoader, [{
        key: 'setRootPath',
        value: function setRootPath(startPath) {
            this._startPath = startPath;
        }
    }, {
        key: 'registerServices',
        value: function registerServices() {
            if (!!this._services) {
                var services = this._services;
                for (var key in services) {
                    if (!!key) {
                        var module = services[key];
                        if (!!module.class) {
                            this._registerClassService(key, module);
                            continue;
                        }

                        if (!!module.factory) {
                            this._registerFactory(key, module);
                            continue;
                        }

                        this._registerProvider(key, module);
                    }
                }
            } else {
                this._logger.info('No services registered');
            }
        }
    }, {
        key: '_registerProvider',
        value: function _registerProvider(name, module) {
            var modulePath = null;
            var deps = null;

            if (!!module.provider) {
                modulePath = require(module.provider); // eslint-disable-line global-require, import/no-dynamic-require
            } else {
                modulePath = module.parameter;
            }

            if (!!module.arguments) {
                deps = module.arguments;
            }

            if (deps === null || deps.length === 0) {
                this._logger.info('Registering provider: [' + name + ']');
                this._container.register(name, [], modulePath);
            } else {
                this._container.register(name, deps, function (args) {
                    return modulePath.apply(undefined, _toConsumableArray(args));
                });
            }
        }
    }, {
        key: '_registerFactory',
        value: function _registerFactory(name, module) {
            var modulePath = this._loadFilePath(module.factory);
            this._logger.info('Registering factory : [' + name + ']');

            this._container.register(name, [], new function Factory() {
                this.createInstance = function () {
                    return new modulePath.default();
                };
            }());
        }
    }, {
        key: '_registerClassService',
        value: function _registerClassService(name, module) {
            var _this = this;

            var modulePath = this._loadFilePath(module.class);
            var deps = [];

            if (!!module.arguments) {
                deps = module.arguments;
            }

            if (deps.length === 0) {
                this._logger.info('Registering service: [' + name + ']');
                this._container.register(name, [], function () {
                    _this._logger.info('Creating instance: ' + modulePath.default.name);
                    return new modulePath.default();
                });
            } else {
                this._logger.info('Registering service with dependencies: [' + name + ']');
                this._container.register(name, deps, function (args) {
                    _this._logger.info('Creating instance: ' + modulePath.default.name);
                    return new (Function.prototype.bind.apply(modulePath.default, [null].concat(_toConsumableArray(args))))();
                });
            }
        }
    }, {
        key: '_loadFilePath',
        value: function _loadFilePath() {
            var moduleFileName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            if (!!moduleFileName) {
                if (this._startPath !== null) {
                    return require(this._startPath + '/' + moduleFileName); // eslint-disable-line global-require, import/no-dynamic-require
                }

                return require(moduleFileName); // eslint-disable-line global-require, import/no-dynamic-require
            }

            throw new Error('File not found ' + moduleFileName);
        }
    }]);

    return ServiceLoader;
}();

exports.default = ServiceLoader;