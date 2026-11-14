import {Container} from 'inversify';
import {Application} from './app/application.js';
import {ConfigService} from './config/config-service.js';
import {LoggerService} from './logger/logger-service.js';

const container = new Container();
container.bind(LoggerService).toSelf().inSingletonScope();
container.bind(ConfigService).toSelf().inSingletonScope();
container.bind(Application).toSelf();

export {container};
