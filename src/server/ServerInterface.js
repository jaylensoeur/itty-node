import ExceptionInterfaceType from '../exception/ExceptionInterfaceType';

class ServerInterface {
    constructor() {
        if (this.constructor === ServerInterface) {
            throw new ExceptionInterfaceType();
        }
    }

    getServer() {
        throw new ExceptionInterfaceType();
    }

    getConfig() {
        throw new ExceptionInterfaceType();
    }

    getContainer() {
        throw new ExceptionInterfaceType();
    }

    boot() {
        throw new ExceptionInterfaceType();
    }
}

export default ServerInterface;
