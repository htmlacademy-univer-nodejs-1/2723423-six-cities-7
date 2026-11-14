import {inject, injectable} from 'inversify';
import mongoose from 'mongoose';
import {LoggerService} from '../logger/logger-service.js';

@injectable()
export class DatabaseService {
  constructor(@inject(LoggerService) private readonly logger: LoggerService) {}

  public async connect(uri: string): Promise<void> {
    const parsed = new URL(uri);
    if (!['mongodb:', 'mongodb+srv:'].includes(parsed.protocol) || parsed.pathname.length < 2) {
      throw new Error('Укажите MongoDB URI с именем базы данных');
    }

    this.logger.info(`Подключение к MongoDB: ${parsed.hostname}${parsed.pathname}`);
    try {
      await mongoose.connect(uri, {serverSelectionTimeoutMS: 5000});
      this.logger.info('Соединение с MongoDB установлено');
    } catch (error) {
      this.logger.error(`Не удалось подключиться к MongoDB: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    await mongoose.disconnect();
  }
}
