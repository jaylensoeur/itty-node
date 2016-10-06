import MiddlewareInterface from './MiddlewareInterface';

class MiddlewareLoader {
    /**
     * @param container
     * @param logger
     */
    constructor(container, logger) {
        this._container = container;
        this._logger = logger;
    }

    /**
     * @param server
     * @param middleware
     */
    register(server, middleware) {
        this._addToMiddlewareStack(server, middleware);
    }

    /**
     * @param server
     * @param middleware
     * @private
     */
    _addToMiddlewareStack(server, middleware) {
        this._logger.info(`Middleware applied: ${method.toUpperCase()} [${middleware.route}] ${middleware.service}`);
        const middlewareInstance = this._container.get(middleware.service);

        if (middlewareInstance instanceof MiddlewareInterface) {
            server.use(middleware.route, middlewareInstance.bind(middlewareInstance).invoke);
        }
    }
}

export default MiddlewareLoader;
