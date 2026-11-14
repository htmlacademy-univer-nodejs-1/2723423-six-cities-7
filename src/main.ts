import 'reflect-metadata';
import {Application} from './app/application.js';
import {container} from './container.js';

container.get(Application).init();
