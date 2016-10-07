'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Container = function () {
    function Container(logger) {
        _classCallCheck(this, Container);

        this._modules = {};
        this._logger = logger;
    }

    _createClass(Container, [{
        key: 'register',
        value: function register(name, dependencies, moduleDef) {
            if (this._modules[name] !== undefined) {
                throw new Error('Module ' + name + ' is already registered. Use swapModule() instead.');
            }

            var moduleReg = {
                name: name,
                deps: dependencies,
                instance: null,
                started: false
            };

            if (typeof moduleDef === 'function') {
                moduleReg.factory = moduleDef;
            } else {
                // if not a factory, we can't inject deps!
                if (dependencies.length > 0) {
                    throw new Error('Module ' + name + ' registered with dependencies without factory');
                }
                // an Object or already configured service
                moduleReg.instance = moduleDef;
            }
            this._modules[name] = moduleReg;
        }
    }, {
        key: 'getArgs',
        value: function getArgs(name) {
            var dep = name;

            switch (name[0]) {
                case '@':
                    var key = name.substring(1);
                    dep = this.get(key);
                    break;

                case '%':
                    dep = null;
                    var keys = name.substring(1, name.length - 1).split('.');
                    if (!!keys && keys.length > 0) {
                        dep = this.get(keys[0]);
                        keys.shift();
                        for (var i in keys) {
                            dep = dep[keys[i]];
                        }
                    }
                    break;
                default:
                    break;
            }

            return dep;
        }
    }, {
        key: 'get',
        value: function get(name) {
            var moduleReg = this._modules[name];

            if (!moduleReg) {
                throw new Error('Module ' + name + ' not found');
            }

            if (!moduleReg.instance) {
                var moduleDeps = this.getDeps(moduleReg);
                if (this.isClass(moduleReg.factory)) {
                    moduleReg.instance = new moduleReg.factory(moduleDeps);
                    moduleReg.instance.prototype = moduleReg.factory.prototype;
                } else {
                    moduleReg.instance = moduleReg.factory(moduleDeps);
                }

                if (!moduleReg.instance) {
                    this._logger.warn('Factory did not instantiate anything for "' + name + '"');
                }
            }
            return moduleReg.instance;
        }
    }, {
        key: 'isClass',
        value: function isClass(func) {
            return typeof func === 'function';
        }
    }, {
        key: 'remove',
        value: function remove(moduleName) {
            var moduleReg = this._modules[moduleName];
            if (moduleReg === undefined) {
                // do nothing
                return;
            }
            if (moduleReg.instance) {
                throw new Error('Module ' + moduleName + ' was already instantiated');
            }
            delete this._modules[moduleName];
        }
    }, {
        key: 'swap',
        value: function swap(moduleName, deps, moduleDef) {
            this.remove(moduleName);
            this.register(moduleName, deps, moduleDef);
        }
    }, {
        key: 'getDeps',
        value: function getDeps(moduleRegistry) {
            var res = [];
            var self = this;

            moduleRegistry.deps.forEach(function (dep) {
                if (dep === moduleRegistry.name) {
                    throw new Error('Module ' + dep + ' can\'t depend on itself');
                }
                res.push(self.getArgs(dep));
            });

            return res;
        }
    }, {
        key: 'reset',
        value: function reset() {
            this._modules = {};
        }
    }, {
        key: 'start',
        value: function start(moduleName, options) {
            var instance = null;
            var startRet = null;

            var mod = this._modules[moduleName];

            if (!mod) {
                throw new Error('Module ' + moduleName + ' is not registered');
            }

            if (mod.started) {
                return mod.instance;
            }

            instance = this.get(moduleName);

            if (!instance) {
                throw new Error('Module ' + moduleName + ' failed to be instantiated');
            }

            if (typeof instance.start === 'function') {
                try {
                    startRet = instance.start();
                } catch (err) {
                    throw new Error('Module ' + moduleName + ' failed to start: ' + err);
                }
            }

            if (options && !!options.async) {
                if (typeof startRet.then !== 'function') {
                    throw new Error('Module ' + moduleName + ' start() method does not return a Promise');
                }

                return startRet.then(function () {
                    mod.started = true;
                    return instance;
                });
            }

            mod.started = true;
            return instance;
        }
    }, {
        key: 'stop',
        value: function stop(moduleName) {
            var mod = this._modules[moduleName];
            if (!mod) {
                return;
            }
            if (!mod.instance || !mod.started) {
                return;
            }
            if (typeof mod.instance.stop === 'function') {
                mod.instance.stop();
            }
            mod.instance = null;
            mod.started = false;
        }
    }, {
        key: 'startAll',
        value: function startAll() {
            var _this = this;

            var moduleKeys = Object.keys(this._modules);
            moduleKeys.forEach(function (key) {
                var moduleReg = _this._modules[key];
                _this.start(moduleReg.name);
            }, this);
        }
    }, {
        key: 'stopAll',
        value: function stopAll() {
            var _this2 = this;

            var moduleKeys = Object.keys(this._modules);
            moduleKeys.forEach(function (key) {
                var moduleReg = _this2._modules[key];
                _this2.stop(moduleReg.name);
            }, this);
        }
    }, {
        key: 'debug',
        value: function debug() {
            var _this3 = this;

            this._logger.debug('** Container Modules **');
            var moduleKeys = Object.keys(this._modules);
            moduleKeys.forEach(function (key) {
                var reg = _this3._modules[key];
                _this3._logger.debug(reg.name, 'instance: ', reg.instance !== undefined ? 'Yes' : 'No', 'factory:', reg.factory !== undefined ? 'Yes' : 'No');
            }, this);
            this._logger.debug('** Container finished **');
        }
    }]);

    return Container;
}();

exports.default = Container;