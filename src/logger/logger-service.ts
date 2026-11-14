import {injectable} from 'inversify';
import pino, {Logger} from 'pino';

@injectable()
export class LoggerService {
  private readonly logger: Logger = pino();

  public info(message: string): void {
    this.logger.info(message);
  }
}
