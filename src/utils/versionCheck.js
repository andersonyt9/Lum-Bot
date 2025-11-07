import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { logger } from './logger.js';

const require = createRequire(import.meta.url);

function getInstalledDiscordJs() {
  try {
    return require('discord.js/package.json').version;
  } catch {
    return 'unknown';
  }
}

function getLatestDiscordJs() {
  try {
    return execSync('npm view discord.js version', { encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

export function printRuntimeBanner() {
  const node = process.version;
  const installed = getInstalledDiscordJs();
  const latest = getLatestDiscordJs();

  logger.title('Lum-bot • Runtime');
  logger.info('Node.js:', node);
  logger.info('discord.js (instalado):', installed);

  if (latest) {
    logger.info('discord.js (último no npm):', latest);
    if (installed !== 'unknown' && installed !== latest) {
      logger.warn('Há uma versão mais nova do discord.js. Rode: npm run update:deps');
    } else {
      logger.ok('Você está na última versão do discord.js.');
    }
  } else {
    logger.warn('Não foi possível consultar o npm (offline?).');
  }
}