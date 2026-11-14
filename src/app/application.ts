import {inject, injectable} from 'inversify';
import {ConfigService} from '../config/config-service.js';
import {LoggerService} from '../logger/logger-service.js';

@injectable()
export class Application {
  constructor(
    @inject(LoggerService) private readonly logger: LoggerService,
    @inject(ConfigService) private readonly config: ConfigService,
  ) {}

  public init(): void {
    this.logger.info('Приложение инициализировано');
    this.logger.info(`Порт приложения: ${this.config.getPort()}`);
  }
}
