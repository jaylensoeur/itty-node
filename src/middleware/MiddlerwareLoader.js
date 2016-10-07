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
        this._logger.info(`Middleware applied: ${middleware.service} [${middleware.route}]`);
        const middlewareInstance = this._container.get(middleware.service);

        if (middlewareInstance instanceof MiddlewareInterface) {
            if (!!middleware.route) {
                server.use(middleware.route, (req, res, next) => {
                    middlewareInstance.invoke(req, res, next);
                });
            } else {
                server.use(middleware.route, (req, res, next) => {
                    middlewareInstance.invoke(req, res, next);
                });
            }
        }
    }
}

export default MiddlewareLoader;
