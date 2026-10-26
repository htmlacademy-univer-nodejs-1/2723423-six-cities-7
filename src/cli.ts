#!/usr/bin/env node
import chalk from 'chalk';
import {runCli} from './cli/commands.js';

runCli(process.argv.slice(2)).catch((error: unknown) => {
  console.error(chalk.red(`Ошибка: ${error instanceof Error ? error.message : String(error)}`));
  process.exitCode = 1;
});
