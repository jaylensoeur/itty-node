class ExceptionInterfaceType extends Error {
    constructor(message = null) {
        super();
        this.message = 'Exception: Trying to using an interface in the wrong way';
        if (!!message) {
            this.message = message;
        }
    }
}

export default ExceptionInterfaceType;
