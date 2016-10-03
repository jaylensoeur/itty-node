class RouteLoader {
    constructor(container, logger) {
        this._container = container;
        this._logger = logger;
    }

    register(server, route) {
        if (route.methods.length > 1) {
            for (const method of route.methods) {
                this._attachRoute(server, method, route.path, route.controller, route.action);
            }
            return;
        }

        this._attachRoute(server, route.methods[0], route.path, route.controller, route.action);
    }

    _attachRoute(server, method, path, service, action) {
        this._logger.info(`Route applied: ${method.toUpperCase()} [${path}] ${service}::${action}`);
        server[method](path, (req, res) => {
            const controller = this._container.get(service);
            controller[action](req, res);
        });
    }
}

export default RouteLoader;
