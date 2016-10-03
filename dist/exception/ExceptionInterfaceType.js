'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ExceptionInterfaceType = function (_Error) {
    _inherits(ExceptionInterfaceType, _Error);

    function ExceptionInterfaceType() {
        var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        _classCallCheck(this, ExceptionInterfaceType);

        var _this = _possibleConstructorReturn(this, (ExceptionInterfaceType.__proto__ || Object.getPrototypeOf(ExceptionInterfaceType)).call(this));

        _this.message = 'Exception: Trying to using an interface in the wrong way';
        if (!!message) {
            _this.message = message;
        }
        return _this;
    }

    return ExceptionInterfaceType;
}(Error);

exports.default = ExceptionInterfaceType;