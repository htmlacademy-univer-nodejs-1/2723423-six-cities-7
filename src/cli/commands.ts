import {readFile} from 'node:fs/promises';
import {extname} from 'node:path';
import chalk from 'chalk';
import {readOffers} from './tsv-reader.js';

function help(): void {
  console.log(chalk.cyan(`Программа для подготовки данных для REST API сервера.

Пример: npm run cli -- --import mocks/offers.tsv

Команды:
  --help                         Выводит справку (команда по умолчанию)
  --version                      Выводит версию приложения
  --import <filepath>             Читает TSV и выводит предложения в консоль
  --generate <n> <filepath> <url>  Генерирует TSV (будет реализовано в следующем задании)`));
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
    console.log(chalk.cyan(JSON.stringify(offer, null, 2)));
    count++;
  }
  console.log(chalk.green(`Прочитано предложений: ${count}`));
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
      throw new Error('Команда --generate будет реализована в следующем задании');
    default:
      throw new Error(`Неизвестная команда: ${command}. Используйте --help`);
  }
}
