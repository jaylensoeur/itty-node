"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RouteLoader = function () {
    function RouteLoader(container, logger) {
        _classCallCheck(this, RouteLoader);

        this._container = container;
        this._logger = logger;
    }

    _createClass(RouteLoader, [{
        key: "register",
        value: function register(server, route) {
            if (route.methods.length > 1) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = route.methods[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var method = _step.value;

                        this._attachRoute(server, method, route.path, route.controller, route.action);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                return;
            }

            this._attachRoute(server, route.methods[0], route.path, route.controller, route.action);
        }
    }, {
        key: "_attachRoute",
        value: function _attachRoute(server, method, path, service, action) {
            var _this = this;

            this._logger.info("Route applied: " + method.toUpperCase() + " [" + path + "] " + service + "::" + action);
            server[method](path, function (req, res) {
                var controller = _this._container.get(service);
                controller[action](req, res);
            });
        }
    }]);

    return RouteLoader;
}();

exports.default = RouteLoader;