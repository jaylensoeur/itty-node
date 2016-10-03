import Yaml from 'yaml-with-import';
import Container from './dependencyInjection/Container';
import ServiceLoader from './dependencyInjection/ServiceLoader';
import RouterLoader from './route/RouteLoader';
import Server from './server/ServerExpressAdapter';
import MiddlewareInterface from './middleware/MiddlewareInterface';
import fsPromise from 'fs-promise';
import Winston from 'winston';

const Logger = Winston.Logger;
const container = new Container();
const yaml = new Yaml();
const environment = process.env.NODE_ENV === 'production' ? 'prd' : process.env.NODE_ENV;
const rootDir = process.env.NODE_ROOT_PATH;
const configPath = rootDir + `/config/${environment}/config.yml`;
const status = fsPromise.existsSync(configPath);

let server = null;
let logger = null;

if (status) {
    logger = new Logger({transports: [new (Winston.transports.Console)()]});
    yaml.setRootPath(rootDir);
    const config = yaml.read(configPath);
    const serviceLoader = new ServiceLoader(container, config.services, logger);
    const routerLoader = new RouterLoader(container, logger);
    serviceLoader.setRootPath(rootDir);
    serviceLoader.registerServices();
    server = new Server(config, container, routerLoader, logger);
} else {
    throw new Error('Config file not found' + configPath);
}

export {
    server as application,
    MiddlewareInterface,
    logger
};