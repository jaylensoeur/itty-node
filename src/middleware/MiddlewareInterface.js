import ExceptionInterfaceType from '../exception/ExceptionInterfaceType';

class MiddlewareInterface {
    invoke(req, res, next) {
        throw new ExceptionInterfaceType(`Implementation is required ${req} ${res} ${next}`);
    }
}

export default MiddlewareInterface;
