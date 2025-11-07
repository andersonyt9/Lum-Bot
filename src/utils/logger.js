import chalk from 'chalk';

export const logger = {
  info: (...a) => console.log(chalk.cyan('ℹ'), ...a),
  ok:   (...a) => console.log(chalk.green('✔'), ...a),
  warn: (...a) => console.log(chalk.yellow('⚠'), ...a),
  err:  (...a) => console.log(chalk.red('✖'), ...a),
  title:(t) => console.log(chalk.bold.magenta(`\n=== ${t} ===`))
};