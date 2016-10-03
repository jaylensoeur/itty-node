import ExceptionInterfaceType from '../exception/ExceptionInterfaceType';

class MiddlewareInterface {
    request() {
        throw new ExceptionInterfaceType();
    }
}

export default MiddlewareInterface;
