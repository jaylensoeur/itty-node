import express from 'express';
import ServerInterface from './ServerInterface';

class ServerExpressAdapter extends ServerInterface {

    constructor(config, container, routeLoader, middlewareLoader, logger) {
        super();
        this._express = express();
        this._config = config;
        this._container = container;
        this._middlewareLoader = middlewareLoader;
        this._routeLoader = routeLoader;
        this._logger = logger;
    }

    getServer() {
        return this._express;
    }

    getConfig() {
        return this._config;
    }

    getContainer() {
        return this._container;
    }

    boot() {
        this._initializeConfig();
        this._run();
    }

    _run() {
        this._express.listen(this._config.server.port, () => {
            this._logger.info(`Server started [${this._config.server.domain}][${this._config.server.port}]`);
        });
    }

    _initializeConfig() {
        const routes = this._config.routes;
        const middlewareStack = this._config.middlewareStack;

        for (const key in routes) {
            this._routeLoader.register(this._express, routes[key]);
        }

        for (const key in middlewareStack) {
            this._middlewareLoader.register(this._express, middlewareStack[key]);
        }
    }
}

export default ServerExpressAdapter;
