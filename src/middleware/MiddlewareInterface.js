import ExceptionInterfaceType from '../exception/ExceptionInterfaceType';

class MiddlewareInterface {
    invoke(req, res, next) {
        throw new ExceptionInterfaceType();
    }
}

export default MiddlewareInterface;
