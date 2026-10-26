import {readFile} from 'node:fs/promises';
import {once} from 'node:events';
import {extname} from 'node:path';
import chalk from 'chalk';
import {generateOffers} from './generate.js';
import {readOffers} from './tsv-reader.js';

function help(): void {
  console.log(chalk.cyan(`Программа для подготовки данных для REST API сервера.

Пример: npm run cli -- --import mocks/offers.tsv

Команды:
  --help                         Выводит справку (команда по умолчанию)
  --version                      Выводит версию приложения
  --import <filepath>             Читает TSV и выводит предложения в консоль
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

async function importOffers(filePath: string): Promise<void> {
  if (extname(filePath).toLowerCase() !== '.tsv') {
    throw new Error('Для импорта требуется файл с расширением .tsv');
  }
  let count = 0;
  for await (const offer of readOffers(filePath)) {
    await print(chalk.cyan(JSON.stringify(offer, null, 2)));
    count++;
  }
  await print(chalk.green(`Прочитано предложений: ${count}`));
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
      if (parameters.length !== 1 || parameters[0].startsWith('--')) {
        throw new Error('Использование: --import <filepath>');
      }
      await importOffers(parameters[0]);
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
