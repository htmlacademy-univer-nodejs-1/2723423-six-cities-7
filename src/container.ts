import {Container} from 'inversify';
import {Model} from 'mongoose';
import {Application} from './app/application.js';
import {ConfigService} from './config/config-service.js';
import {OfferModelToken, UserModelToken} from './container.types.js';
import {DatabaseService} from './database/database-service.js';
import {LoggerService} from './logger/logger-service.js';
import {OfferDocument, OfferModel} from './modules/offer/offer.model.js';
import {OfferService} from './modules/offer/offer-service.js';
import {UserDocument, UserModel} from './modules/user/user.model.js';
import {UserService} from './modules/user/user-service.js';

const container = new Container();
container.bind(LoggerService).toSelf().inSingletonScope();
container.bind(ConfigService).toSelf().inSingletonScope();
container.bind(Application).toSelf();
container.bind(DatabaseService).toSelf().inSingletonScope();
container.bind<Model<UserDocument>>(UserModelToken).toConstantValue(UserModel);
container.bind<Model<OfferDocument>>(OfferModelToken).toConstantValue(OfferModel);
container.bind(UserService).toSelf();
container.bind(OfferService).toSelf();

export {container};
