import Yaml from 'yaml-with-import';
import fsPromise from 'fs-promise';
import Winston from 'winston';

import Container from './dependencyInjection/Container';
import ServiceLoader from './dependencyInjection/ServiceLoader';
import RouterLoader from './route/RouteLoader';
import MiddlewareLoader from './middleware/MiddlerwareLoader';
import Server from './server/ServerExpressAdapter';
import MiddlewareInterface from './middleware/MiddlewareInterface';

const Logger = Winston.Logger;
const container = new Container();
const yaml = new Yaml();
const environment = process.env.NODE_ENV === 'production' ? 'prd' : process.env.NODE_ENV;
const rootDir = process.env.NODE_ROOT_PATH;

if (!rootDir) {
    throw new Error('Missing NODE_ROOT_PATH environment variable');
}

const configPath = `${rootDir}/config/${environment}/config.yml`;

const status = fsPromise.existsSync(configPath);

if (!status) {
    throw new Error(`Config file not found ${configPath}`);
}

const logger = new Logger({ transports: [new (Winston.transports.Console)()] });
yaml.setRootPath(rootDir);
const config = yaml.read(configPath);
container.register('config', [], config);
const serviceLoader = new ServiceLoader(container, config.services, logger);
const routerLoader = new RouterLoader(container, logger);
const middlewareLoader = new MiddlewareLoader(container, logger);
serviceLoader.setRootPath(rootDir);
serviceLoader.registerServices();
const server = new Server(
    config,
    container,
    routerLoader,
    middlewareLoader,
    logger
);

export {
    server as application,
    MiddlewareInterface,
    logger,
};

