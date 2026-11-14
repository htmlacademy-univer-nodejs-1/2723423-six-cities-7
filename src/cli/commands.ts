import {readFile} from 'node:fs/promises';
import {once} from 'node:events';
import {extname} from 'node:path';
import chalk from 'chalk';
import {container} from '../container.js';
import {DatabaseService} from '../database/database-service.js';
import {OfferService} from '../modules/offer/offer-service.js';
import {UserService} from '../modules/user/user-service.js';
import {generateOffers} from './generate.js';
import {readOffers} from './tsv-reader.js';

function help(): void {
  console.log(chalk.cyan(`Программа для подготовки данных для REST API сервера.

Пример: npm run cli -- --import mocks/offers.tsv <mongodb-uri>

Команды:
  --help                         Выводит справку (команда по умолчанию)
  --version                      Выводит версию приложения
  --import <filepath> <mongodb-uri>  Сохраняет предложения из TSV в MongoDB
  --generate <n> <filepath> <url>  Генерирует TSV из данных JSON-сервиса`));
}

async function print(text: string): Promise<void> {
  if (!process.stdout.write(`${text}\n`)) {
    await once(process.stdout, 'drain');
  }
}

async function version(): Promise<void> {
  const content = await readFile(new URL('../../package.json', import.meta.url), 'utf8');
  const data: unknown = JSON.parse(content);
  if (typeof data !== 'object' || data === null || !('version' in data) || typeof data.version !== 'string') {
    throw new Error('В package.json отсутствует версия приложения');
  }
  console.log(chalk.green(data.version));
}

async function importOffers(filePath: string, uri: string): Promise<void> {
  if (extname(filePath).toLowerCase() !== '.tsv') {
    throw new Error('Для импорта требуется файл с расширением .tsv');
  }

  const database = container.get(DatabaseService);
  await database.connect(uri);
  try {
    const users = container.get(UserService);
    const offers = container.get(OfferService);
    let count = 0;
    for await (const offer of readOffers(filePath)) {
      let author = await users.findByEmail(offer.author.email);
      if (!author) {
        author = await users.create(offer.author);
      }
      await offers.create(offer, author._id);
      count++;
    }
    await print(chalk.green(`Импортировано предложений: ${count}`));
  } finally {
    await database.disconnect();
  }
}

export async function runCli(args: string[]): Promise<void> {
  const [command = '--help', ...parameters] = args;
  switch (command) {
    case '--help':
    case '--version':
      if (parameters.length !== 0) {
        throw new Error(`Команда ${command} не принимает аргументы`);
      }
      if (command === '--help') {
        help();
      } else {
        await version();
      }
      break;
    case '--import':
      if (parameters.length !== 2 || parameters[0].startsWith('--')) {
        throw new Error('Использование: --import <filepath> <mongodb-uri>');
      }
      await importOffers(parameters[0], parameters[1]);
      break;
    case '--generate':
      if (parameters.length !== 3) {
        throw new Error('Использование: --generate <n> <filepath> <url>');
      }
      {
        const [amount, filePath, url] = parameters;
        const count = Number(amount);
        if (!Number.isSafeInteger(count) || count < 1) {
          throw new Error('Количество предложений должно быть положительным целым числом');
        }
        if (extname(filePath).toLowerCase() !== '.tsv') {
          throw new Error('Для генерации требуется файл с расширением .tsv');
        }
        await generateOffers(count, filePath, url);
        await print(chalk.green(`Сгенерировано предложений: ${count}. Файл: ${filePath}`));
      }
      break;
    default:
      throw new Error(`Неизвестная команда: ${command}. Используйте --help`);
  }
}
