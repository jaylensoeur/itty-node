class ServiceLoader {
    constructor(container, services, logger) {
        this._services = services;
        this._container = container;
        this._logger = logger;
        this._startPath = null;
    }

    setRootPath(startPath) {
        this._startPath = startPath;
    }

    registerServices() {
        if (!!this._services) {
            const services = this._services;
            for (const key in services) {
                if (!!key) {
                    const module = services[key];
                    if (!!module.class) {
                        this._registerClassService(key, module);
                        continue;
                    }

                    if (!!module.factory) {
                        this._registerFactory(key, module);
                        continue;
                    }

                    this._registerProvider(key, module);
                }
            }
        } else {
            this._logger.info('No services registered');
        }
    }

    _registerProvider(name, module) {
        let modulePath = null;
        let deps = null;

        if (!!module.provider) {
            modulePath = this._loadFilePath(module.provider);
        } else {
            modulePath = module.parameter;
        }

        if (!!module.arguments) {
            deps = module.arguments;
        }

        if (deps === null || deps.length === 0) {
            this._logger.info(`Registering provider: [${name}]`);
            this._container.register(name, [], modulePath);
        } else {
            this._container.register(name, deps, (args) => {
                return modulePath(...args);
            });
        }
    }

    _registerFactory(name, module) {
        const modulePath = this._loadFilePath(module.factory);
        this._logger.info(`Registering factory : [${name}]`);

        this._container.register(name, [], new function Factory() {
            this.createInstance = () => new modulePath.default();
        }());
    }

    _registerClassService(name, module) {
        const modulePath = this._loadFilePath(module.class);
        let deps = [];

        if (!!module.arguments) {
            deps = module.arguments;
        }

        if (deps.length === 0) {
            this._logger.info(`Registering service: [${name}]`);
            this._container.register(name, [], () => {
                this._logger.info(`Creating instance: ${modulePath.default.name}`);
                return new modulePath.default();
            });
        } else {
            this._logger.info(`Registering service with dependencies: [${name}]`);
            this._container.register(name, deps, (args) => {
                this._logger.info(`Creating instance: ${modulePath.default.name}`);
                return new modulePath.default(...args);
            });
        }
    }

    _loadFilePath(moduleFileName = null) {
        if (!!moduleFileName) {
            if (this._startPath !== null) {
                return require(`${this._startPath}/${moduleFileName}`); // eslint-disable-line global-require, import/no-dynamic-require
            }

            return require(moduleFileName); // eslint-disable-line global-require, import/no-dynamic-require
        }

        throw new Error(`File not found ${moduleFileName}`);
    }
}

export default ServiceLoader;
