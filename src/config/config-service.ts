import {config as loadEnv} from 'dotenv';
import convict, {Config} from 'convict';
import formats from 'convict-format-with-validator';
import {injectable} from 'inversify';

type AppConfig = {
  port: number;
  dbHost: string;
  salt: string;
};

convict.addFormat(formats.ipaddress);

@injectable()
export class ConfigService {
  private readonly config: Config<AppConfig>;

  constructor() {
    loadEnv();
    this.config = convict<AppConfig>({
      port: {
        doc: 'Порт приложения',
        format: 'port',
        default: null,
        env: 'PORT',
      },
      dbHost: {
        doc: 'IP-адрес сервера базы данных',
        format: 'ipaddress',
        default: null,
        env: 'DB_HOST',
      },
      salt: {
        doc: 'Соль для паролей',
        format: (value: string) => {
          if (typeof value !== 'string' || value.trim().length === 0) {
            throw new Error('SALT должна быть непустой строкой');
          }
        },
        default: null,
        env: 'SALT',
        sensitive: true,
      },
    });
    this.config.validate({allowed: 'strict'});
  }

  public getPort(): number {
    return this.config.get('port');
  }

  public getSalt(): string {
    return this.config.get('salt');
  }
}
