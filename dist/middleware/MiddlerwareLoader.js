'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MiddlewareInterface = require('./MiddlewareInterface');

var _MiddlewareInterface2 = _interopRequireDefault(_MiddlewareInterface);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MiddlewareLoader = function () {
    /**
     * @param container
     * @param logger
     */
    function MiddlewareLoader(container, logger) {
        _classCallCheck(this, MiddlewareLoader);

        this._container = container;
        this._logger = logger;
    }

    /**
     * @param server
     * @param middleware
     */


    _createClass(MiddlewareLoader, [{
        key: 'register',
        value: function register(server, middleware) {
            this._addToMiddlewareStack(server, middleware);
        }

        /**
         * @param server
         * @param middleware
         * @private
         */

    }, {
        key: '_addToMiddlewareStack',
        value: function _addToMiddlewareStack(server, middleware) {
            this._logger.info('Middleware applied: ' + middleware.service + ' [' + middleware.route + ']');
            var middlewareInstance = this._container.get(middleware.service);

            if (middlewareInstance instanceof _MiddlewareInterface2.default) {
                if (!!middleware.route) {
                    server.use(middleware.route, middlewareInstance.invoke.bind(middlewareInstance));
                } else {
                    server.use(middlewareInstance.invoke.bind(middlewareInstance));
                }
            }
        }
    }]);

    return MiddlewareLoader;
}();

exports.default = MiddlewareLoader;